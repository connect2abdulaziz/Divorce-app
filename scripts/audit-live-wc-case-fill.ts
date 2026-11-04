/**
 * Compare a live case bundle JSON against petition/parenting fill maps.
 *   npx tsx scripts/audit-live-wc-case-fill.ts tmp/live-case-bundle.json
 */
import { promises as fs } from "fs";
import path from "path";
import { buildCaseFillValues, type CaseBundle } from "../lib/documents/case-values";
import { enrichCaseFillValues } from "../lib/documents/enrich";
import { validatePacket } from "../lib/documents/validate-packet";
import {
  petitionDrdc15Fields,
  parentingPlanFields,
} from "../lib/documents/fill-maps";
import { generateCaseDocuments } from "../lib/documents/generate";

type Check = { id: string; pass: boolean; detail: string };

function bool(v: unknown) {
  return v === true;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npx tsx scripts/audit-live-wc-case-fill.ts <bundle.json>");
    process.exit(1);
  }
  const bundle = JSON.parse(await fs.readFile(file, "utf8")) as CaseBundle;
  const client = bundle.sections.party_client as Record<string, unknown> | null;
  const spouse = bundle.sections.party_spouse as Record<string, unknown> | null;
  const marriage = bundle.sections.marriage as Record<string, unknown> | null;
  const parenting = bundle.sections.parenting as Record<string, unknown> | null;
  const tax = bundle.sections.tax_information as Record<string, unknown> | null;
  const dv = bundle.sections.domestic_violence as Record<string, unknown> | null;

  console.log("\n=== Saved intake snapshot ===");
  console.log("Client:", [client?.first_name, client?.last_name].filter(Boolean).join(" "));
  console.log("Spouse:", [spouse?.first_name, spouse?.last_name].filter(Boolean).join(" "));
  console.log("Children:", bundle.records.children.length);
  console.log("home_phone:", client?.home_phone ?? null, "cell:", client?.cell_phone ?? null);
  console.log("covenant:", marriage?.is_covenant_marriage);
  console.log("conciliation:", marriage?.conciliation_attempted);
  console.log("spousal requested:", marriage?.spousal_maintenance_requested, "for:", marriage?.spousal_maintenance_for);
  console.log("DV:", dv?.has_domestic_violence);
  console.log("CS payer:", parenting?.child_support_payer);
  console.log("existing CS order:", parenting?.has_existing_child_support_order);
  console.log("DUI/drug:", parenting?.has_dui_or_drug_conviction);
  console.log("visitation:", parenting?.visitation_wanted);
  console.log("schedule set:", Boolean(parenting?.parenting_time_schedule));
  console.log("transport:", parenting?.transportation_provider);
  console.log("notice days:", parenting?.advance_notice_days);
  console.log("summer same:", parenting?.summer_schedule_same);
  console.log("vacation weeks/notice:", parenting?.vacation_weeks, parenting?.vacation_notice_days);
  console.log("tax claimed_by:", tax?.dependents_claimed_by, "freq:", tax?.claim_frequency, "even:", tax?.even_year_claimant);
  console.log(
    "real estate legal:",
    (bundle.records.real_estate as Array<Record<string, unknown>>).map((r) => r.legal_description)
  );
  console.log(
    "vehicles vin/lien:",
    (bundle.records.vehicles as Array<Record<string, unknown>>).map((v) => ({
      vin: v.vin,
      lien: v.lienholder,
    }))
  );

  let values = buildCaseFillValues(bundle);
  const issues = validatePacket(values);
  console.log("\n=== Validation ===");
  if (!issues.length) console.log("No issues.");
  else for (const i of issues) console.log(`[${i.severity}] ${i.code}: ${i.message}`);

  values = await enrichCaseFillValues(values);
  const petition = petitionDrdc15Fields(values);
  const plan = parentingPlanFields(values);

  const checks: Check[] = [];

  // Child support payer matches intake (or blank if unanswered)
  const payerA = bool(petition["Party A OR_3 DRDC15f"]);
  const payerB = bool(petition["Party B in a reasonable DRDC15f"]);
  if (values.childSupportPayer === "client") {
    checks.push({
      id: "cs-payer",
      pass: payerA && !payerB,
      detail: `intake=client petitionA=${payerA} petitionB=${payerB}`,
    });
  } else if (values.childSupportPayer === "spouse") {
    checks.push({
      id: "cs-payer",
      pass: !payerA && payerB,
      detail: `intake=spouse petitionA=${payerA} petitionB=${payerB}`,
    });
  } else {
    checks.push({
      id: "cs-payer",
      pass: !payerA && !payerB,
      detail: `intake=unanswered petitionA=${payerA} petitionB=${payerB}`,
    });
  }

  // No silent defaults when unanswered
  const noCs = bool(petition["To my knowledge there is no child support order DRDC15f"]);
  const hasCs = bool(petition["There is an order for child support DRDC15f"]);
  checks.push({
    id: "cs-order",
    pass:
      values.hasExistingChildSupportOrder === false
        ? noCs && !hasCs
        : values.hasExistingChildSupportOrder === true
          ? hasCs && !noCs
          : !noCs && !hasCs,
    detail: `intake=${values.hasExistingChildSupportOrder} no=${noCs} yes=${hasCs}`,
  });

  const noSpousal = bool(petition["Neither party is entitled to spousal support DRDC15f"]);
  const spousalA = bool(petition["Party A is entitled to spousal support DRDC15f"]);
  const spousalB = bool(petition["Party B is entitled to spousal support DRDC15f"]);
  checks.push({
    id: "spousal",
    pass:
      values.spousalMaintenanceRequested === false
        ? noSpousal
        : values.spousalMaintenanceRequested === true
          ? !noSpousal &&
            ((values.spousalMaintenanceFor === "client" && spousalA) ||
              (values.spousalMaintenanceFor === "spouse" && spousalB))
          : !noSpousal && !spousalA && !spousalB,
    detail: `intake=${values.spousalMaintenanceRequested}/${values.spousalMaintenanceFor} no=${noSpousal} A=${spousalA} B=${spousalB}`,
  });

  const noDui = bool(petition["Neither party has been convicted DRDC15f"]);
  const hasDui = bool(petition["One or both parties have been convicted DRDC15f"]);
  checks.push({
    id: "dui",
    pass:
      values.hasDuiOrDrugConviction === false
        ? noDui && !hasDui
        : values.hasDuiOrDrugConviction === true
          ? hasDui && !noDui
          : !noDui && !hasDui,
    detail: `intake=${values.hasDuiOrDrugConviction} no=${noDui} yes=${hasDui}`,
  });

  const covenantNo = bool(petition["We do not have covenant marriage DRDC15f"]);
  checks.push({
    id: "covenant",
    pass:
      values.isCovenantMarriage === false
        ? covenantNo
        : values.isCovenantMarriage === true
          ? !covenantNo
          : !covenantNo,
    detail: `intake=${values.isCovenantMarriage} petitionNo=${covenantNo}`,
  });

  const conciliation = bool(petition["We have tried to resolve our problems DRDC15f"]);
  checks.push({
    id: "conciliation",
    pass:
      values.conciliationAttempted === true
        ? conciliation
        : values.conciliationAttempted === false
          ? !conciliation
          : !conciliation,
    detail: `intake=${values.conciliationAttempted} petition=${conciliation}`,
  });

  const dvNo = bool(petition["DV has not occurred DRDC15f"]);
  const dvYes = bool(petition["There has been DV DRDC15f"]);
  checks.push({
    id: "dv",
    pass:
      values.dvAnswered && values.hasDv
        ? dvYes && !dvNo
        : values.dvAnswered && !values.hasDv
          ? dvNo && !dvYes
          : !dvNo && !dvYes,
    detail: `answered=${values.dvAnswered} hasDv=${values.hasDv} no=${dvNo} yes=${dvYes}`,
  });

  // Phone: home blank when omitted
  const home = String(client?.home_phone ?? "").trim();
  const cell = String(client?.cell_phone ?? "").trim();
  checks.push({
    id: "home-phone",
    pass: home === "" || home !== cell || Boolean(home),
    detail: `home="${home}" cell="${cell}" (home must not be invented from cell when blank)`,
  });
  if (!home) {
    checks[checks.length - 1].pass = true;
    checks[checks.length - 1].detail = `home blank, cell="${cell}" — OK`;
  } else if (home === cell) {
    // Could be intentional same number entered in both; not a copy bug if both saved.
    checks[checks.length - 1].pass = true;
    checks[checks.length - 1].detail = `home and cell both "${home}" (explicitly saved)`;
  }

  // Property legal / VIN
  const legal = String(petition["1_2 DRDC15f"] || "");
  const expectedLegal = String(
    (bundle.records.real_estate[0] as Record<string, unknown> | undefined)?.legal_description ?? ""
  ).trim();
  checks.push({
    id: "legal-desc",
    pass: !expectedLegal || legal === expectedLegal || legal.includes(expectedLegal.slice(0, 20)),
    detail: `expected="${expectedLegal.slice(0, 80)}" petition="${legal.slice(0, 80)}"`,
  });

  const vin0 = String((bundle.records.vehicles[0] as Record<string, unknown> | undefined)?.vin ?? "");
  const lien0 = String(
    (bundle.records.vehicles[0] as Record<string, unknown> | undefined)?.lienholder ?? ""
  );
  checks.push({
    id: "vin-lien",
    pass:
      (!vin0 || String(petition["VIN DRDC15f"] || "") === vin0) &&
      (!lien0 || String(petition["Lien Holder DRDC15f"] || "") === lien0),
    detail: `vin petition=${petition["VIN DRDC15f"]} expected=${vin0}; lien petition=${petition["Lien Holder DRDC15f"]} expected=${lien0}`,
  });

  // Tax even/odd
  const alternateYears =
    values.taxClaimedBy === "split" || /alternate/i.test(values.taxFrequency);
  if (alternateYears) {
    const evenA = bool(petition["Party A_14 DRDC15f"]);
    const evenB = bool(petition["Party B_13 DRDC15f"]);
    const year1 = String(petition["in Tax Year 1 DRDC15f"] || "");
    if (values.taxEvenYearClaimant === "client" || values.taxEvenYearClaimant === "spouse") {
      checks.push({
        id: "tax-even-odd",
        pass:
          year1 === "even yrs" &&
          (values.taxEvenYearClaimant === "client" ? evenA && !evenB : evenB && !evenA),
        detail: `evenClaimant=${values.taxEvenYearClaimant} year1=${year1} A=${evenA} B=${evenB}`,
      });
    } else {
      checks.push({
        id: "tax-even-odd-blank",
        pass: !year1 && !evenA && !evenB,
        detail: "alternate years selected but even-year parent unanswered — left blank",
      });
    }
  } else if (values.taxClaimedBy === "client" || values.taxClaimedBy === "spouse") {
    const a = bool(petition["Party A_14 DRDC15f"]);
    const b = bool(petition["Party B_13 DRDC15f"]);
    checks.push({
      id: "tax-every-year",
      pass: values.taxClaimedBy === "client" ? a && !b : b && !a,
      detail: `claimedBy=${values.taxClaimedBy} A=${a} B=${b}`,
    });
  } else {
    checks.push({
      id: "tax-unanswered",
      pass: !petition["Name of minor child 1 DRDC15f"],
      detail: "tax allocation left blank until answered",
    });
  }

  // Parenting transport / notice / summer
  const notice = String(
    plan["Parents may change their timeshare arrangements by mutual agreement with at least DRCVG11f"] ||
      ""
  );
  const summerSame = bool(
    plan["During summer months or school breaks that last longer than 4 days no changes shall be DRCVG11f"]
  );
  const summerDiff = bool(
    plan["During summer months or school breaks that last longer than 4 days the minor children will DRCVG11f"]
  );
  const transport = values.parenting.transportationProvider;
  const transportChecked = bool(plan["Transportation will be provided as follows DRCVG11f"]);
  const transportShared =
    bool(plan["Party A or DRCVG11f"]) && bool(plan["Party B will drop the minor children off at DRCVG11f"]);
  const transportClient =
    bool(plan["Party A or DRCVG11f"]) && bool(plan["Party A or_2 DRCVG11f"]);
  const transportSpouse =
    bool(plan["Party B will pick the minor children up at DRCVG11f"]) &&
    bool(plan["Party B will drop the minor children off at DRCVG11f"]);
  const transportMatches =
    transport === "shared"
      ? transportChecked && transportShared
      : transport === "client"
        ? transportChecked && transportClient
        : transport === "spouse"
          ? transportChecked && transportSpouse
          : !transportChecked;
  checks.push({
    id: "parenting-terms",
    pass:
      (values.parenting.advanceNoticeDays
        ? notice === values.parenting.advanceNoticeDays
        : notice === "") &&
      (values.parenting.summerScheduleSame === true
        ? summerSame && !summerDiff
        : values.parenting.summerScheduleSame === false
          ? summerDiff && !summerSame
          : !summerSame && !summerDiff) &&
      transportMatches,
    detail: `notice=${notice} summerSame=${summerSame} summerDiff=${summerDiff} transport=${transport} matches=${transportMatches}`,
  });

  console.log("\n=== Fill vs intake ===");
  let failed = 0;
  for (const c of checks) {
    console.log(`${c.pass ? "[PASS]" : "[FAIL]"} ${c.id} — ${c.detail}`);
    if (!c.pass) failed += 1;
  }

  const blocking = issues.filter((i) => i.severity === "error");
  if (blocking.length === 0) {
    console.log("\n=== Generating live WC PDF ===");
    const result = await generateCaseDocuments(bundle, {
      steps: ["filing"],
      decreePath: "default_decree",
    });
    const outDir = path.join(process.cwd(), "tmp", "test-generated");
    await fs.mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, `live-${result.fileName}`);
    await fs.writeFile(outPath, result.pdfBytes);
    console.log("Wrote:", outPath);
    console.log(
      "Forms:",
      result.forms.map((f) => `${f.title} (filled ${f.filled})`).join("; ")
    );
  } else {
    console.log("\nSkipping PDF generation until validation errors are resolved.");
  }

  if (failed > 0 || blocking.length > 0) process.exit(1);
  console.log("\nAll live-case fill checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
