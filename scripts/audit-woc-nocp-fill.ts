/**
 * Compare Audit NoChildrenProperty bundle to WOC petition fills and generate PDF.
 *   npx tsx scripts/audit-woc-nocp-fill.ts tmp/woc-live-bundle.json
 */
import { promises as fs } from "fs";
import path from "path";
import { buildCaseFillValues, type CaseBundle } from "../lib/documents/case-values";
import { validatePacket } from "../lib/documents/validate-packet";
import { petitionDrda10Fields } from "../lib/documents/fill-maps";
import { generateCaseDocuments } from "../lib/documents/generate";

type Check = { id: string; pass: boolean; detail: string };

function bool(v: unknown) {
  return v === true;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npx tsx scripts/audit-woc-nocp-fill.ts <bundle.json>");
    process.exit(1);
  }
  const bundle = JSON.parse(await fs.readFile(file, "utf8")) as CaseBundle;
  const values = buildCaseFillValues(bundle);
  const issues = validatePacket(values);
  const petition = petitionDrda10Fields(values);

  console.log("\n=== Intake snapshot ===");
  console.log("Client:", values.clientName, "gender:", values.clientGender);
  console.log("Spouse:", values.spouseName, "gender:", values.spouseGender);
  console.log("pregnant:", values.pregnant, "answered:", values.pregnancyAnswered);
  console.log("spousal:", values.spousalMaintenanceRequested);
  console.log("written agreement:", values.hasWrittenAgreement);
  console.log("tax forward/prev:", values.taxGoingForwardFiling, values.taxPreviousYearsFiling);
  console.log("RE:", values.realEstate[0]);
  console.log("Retirement:", values.retirement[0]);
  console.log("Debt:", values.communityDebts[0]);
  console.log("Separate prop gate:", values.hasSeparateProperty);

  console.log("\n=== Validation ===");
  if (!issues.length) console.log("No issues.");
  else for (const i of issues) console.log(`[${i.severity}] ${i.code}: ${i.message}`);

  const checks: Check[] = [];

  const addr = String(petition["Real estate located at DRDA10f"] || "");
  const mortgage = String(petition["undefined_5 DRDA10f"] || "");
  const legal1 = String(petition["Legal Description 1 DRDA10f"] || "");
  const sellA = bool(petition["A real estate DRDA10f"]);
  const sellB = bool(petition["B real estate DRDA10f"]);
  checks.push({
    id: "real-estate",
    pass:
      addr.includes("789 Example Street") &&
      mortgage === "150000" &&
      /sell/i.test(legal1) &&
      /50/i.test(legal1) &&
      sellA &&
      sellB,
    detail: `addr=${addr} mortgage=${mortgage} legal1=${legal1} A=${sellA} B=${sellB}`,
  });

  const retDesc = String(petition["1_4 DRDA10f"] || "");
  const retVal = String(petition["undefined_55 DRDA10f"] || "");
  const retA = bool(petition["A pension 1 DRDA10f"]);
  const retB = bool(petition["B pension 1 DRDA10f"]);
  checks.push({
    id: "retirement",
    pass:
      bool(petition["Pension retirement DRDA10f"]) &&
      /401/.test(retDesc) &&
      /equal|50/i.test(retDesc) &&
      retVal === "50000" &&
      retA &&
      retB,
    detail: `desc=${retDesc} value=${retVal} A=${retA} B=${retB}`,
  });

  const debtDesc = String(petition["Description of Debt 1 DRDA10f"] || "");
  const debtAmt = String(petition["undefined_72 DRDA10f"] || "");
  const debtA = bool(petition["A debt 1 DRDA10f"]);
  const debtB = bool(petition["B debt 1 DRDA10f"]);
  checks.push({
    id: "community-debt",
    pass:
      debtAmt === "1000" &&
      debtA &&
      debtB &&
      /700/.test(debtDesc) &&
      /300/.test(debtDesc),
    detail: `desc=${debtDesc} amt=${debtAmt} A=${debtA} B=${debtB}`,
  });

  checks.push({
    id: "separate-property-neither",
    pass:
      bool(petition["I do not have property DRDA10f"]) &&
      bool(petition["Party B does not have any property DRDA10f"]),
    detail: `A=${petition["I do not have property DRDA10f"]} B=${petition["Party B does not have any property DRDA10f"]}`,
  });

  const pregA = bool(petition["Party A not pregnant DRDA10f"]);
  const pregB = bool(petition["Party B IS NOT pregnant OR DRDA10f"]);
  const pregAYes = bool(petition["Party A is pregnant DRDA10f"]);
  const pregBYes = bool(petition["Party B IS pregnant DRDA10f"]);
  checks.push({
    id: "pregnancy-wife-party-b",
    pass: !values.pregnant && pregB && !pregAYes && !pregBYes,
    detail: `notPregnantA=${pregA} notPregnantB=${pregB} pregnantA=${pregAYes} pregnantB=${pregBYes}`,
  });

  checks.push({
    id: "spousal-none",
    pass: bool(petition["Neither party entitled to spousal support DRDA10f"]),
    detail: `neither=${petition["Neither party entitled to spousal support DRDA10f"]}`,
  });

  checks.push({
    id: "tax-returns",
    pass:
      bool(petition["File separate federal and state tax returns DRDA10f"]) &&
      bool(petition["For previous years DRDA10f"]) &&
      bool(petition["The parties will file joint federal and state income tax returns For previousDRDA10f"]),
    detail: `separateGoing=${petition["File separate federal and state tax returns DRDA10f"]} prevJoint=${petition["The parties will file joint federal and state income tax returns For previousDRDA10f"]}`,
  });

  checks.push({
    id: "written-agreement",
    pass: bool(petition["Party A and B do not have agreement DRDA10f"]),
    detail: `noAgreement=${petition["Party A and B do not have agreement DRDA10f"]} has=${petition["Party A and B have a written agreement DRDA10f"]}`,
  });

  const vehicleB = bool(petition["B motor vehicles 1 DRDA10f"]);
  checks.push({
    id: "vehicle-to-b",
    pass: vehicleB && String(petition["Make DRDA10f"] || "").includes("Toyota"),
    detail: `make=${petition["Make DRDA10f"]} B=${vehicleB}`,
  });

  console.log("\n=== Fill vs intake ===");
  let failed = 0;
  for (const c of checks) {
    console.log(`${c.pass ? "[PASS]" : "[FAIL]"} ${c.id} — ${c.detail}`);
    if (!c.pass) failed += 1;
  }

  const blocking = issues.filter((i) => i.severity === "error");
  if (blocking.length === 0) {
    console.log("\n=== Generating WOC PDF ===");
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
      "Track:",
      result.track,
      "Forms:",
      result.forms.map((f) => `${f.title}(${f.filled})`).join("; ")
    );
    const childForm = result.forms.some((f) => /child|parenting|support worksheet/i.test(f.title));
    console.log("Child-related forms excluded:", !childForm);
  } else {
    console.log("\nSkipping PDF — validation errors remain.");
  }

  if (failed || blocking.length) process.exit(1);
  console.log("\nAll WOC NoChildrenProperty checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
