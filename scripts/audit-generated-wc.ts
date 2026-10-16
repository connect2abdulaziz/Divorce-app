/**
 * Generate a with-children test packet, then audit AcroForm fields against
 * the known filing issues (coversheet case type, no-children contradiction,
 * joint LDM exclusivity, schedule split, property tables, DOB/marriage ages).
 *
 *   npx tsx scripts/audit-generated-wc.ts
 */
import { promises as fs } from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { generateCaseDocuments } from "../lib/documents/generate";
import { buildTestCaseBundleWithChildren } from "../lib/documents/test-fixture";
import { buildCaseFillValues } from "../lib/documents/case-values";
import { enrichCaseFillValues } from "../lib/documents/enrich";
import { validatePacket } from "../lib/documents/validate-packet";
import { fieldsForTemplate } from "../lib/documents/fill-maps";

type Check = {
  id: string;
  title: string;
  pass: boolean;
  detail: string;
};

function asBool(v: unknown): boolean | null {
  if (typeof v === "boolean") return v;
  return null;
}

async function readMergedFieldSnapshot(
  pdfBytes: Uint8Array
): Promise<Record<string, string | boolean>> {
  const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const form = pdf.getForm();
  const out: Record<string, string | boolean> = {};
  for (const field of form.getFields()) {
    const name = field.getName();
    try {
      const text = form.getTextField(name).getText();
      out[name] = text ?? "";
      continue;
    } catch {
      /* not text */
    }
    try {
      out[name] = form.getCheckBox(name).isChecked();
      continue;
    } catch {
      /* not checkbox */
    }
  }
  return out;
}

async function main() {
  const bundle = buildTestCaseBundleWithChildren();
  let values = buildCaseFillValues(bundle);
  const issues = validatePacket(values);
  console.log("\n=== Pre-generate validation ===");
  if (issues.length === 0) console.log("No validation issues.");
  else {
    for (const issue of issues) {
      console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
    }
  }

  values = await enrichCaseFillValues(values);
  console.log("\n=== Schedule enrichment ===");
  console.log("source:", values.parenting.scheduleSource);
  console.log("Party A:", values.parenting.schedulePartyA.slice(0, 160));
  console.log("Party B:", values.parenting.schedulePartyB.slice(0, 160));

  const cover = fieldsForTemplate("wc-filing-coversheet", values);
  const petition = fieldsForTemplate("wc-filing-petition", values);
  const parenting = fieldsForTemplate("wc-filing-parenting-plan", values);
  const injunction = fieldsForTemplate("wc-filing-injunction", values);
  const pipOrder = fieldsForTemplate("wc-filing-parent-info", values);
  const affidavit = fieldsForTemplate("wc-filing-affidavit-children", values);

  const checks: Check[] = [];

  const dissolution = asBool(cover["undefined_8 DRSDS10f-c"]) === true;
  const legalDecisionMaking =
    asBool(cover["Legal Decisionmaking n Order DRSDS10f-c"]) === true;
  checks.push({
    id: "p1-dissolution",
    title: "Page 1 — Dissolution/Divorce only (not also legal decision-making)",
    pass: dissolution && !legalDecisionMaking,
    detail:
      dissolution && !legalDecisionMaking
        ? "Dissolution checkbox only."
        : `dissolution=${dissolution}, legalDecisionMaking=${legalDecisionMaking}`,
  });

  const coverChildren = Boolean(cover["Child NameRow1 DRSDS10f-c"]);
  const noInterpreter = asBool(cover["No interpreter12 DRSDS10f-c"]) === true;
  const coverEmailOk =
    String(cover["1_2 Emp Add DRSDS10f-c"] || "") === values.clientEmail &&
    String(cover["1_3 DRSDS10f-c"] || "") === values.spouseEmail;
  const coverDobOk =
    String(cover["or_2 DRSDS10f-c"] || "") === values.clientDob &&
    String(cover["or_3 DRSDS10f-c"] || "") === values.spouseDob;
  const coverPhoneOk =
    String(cover["undefined_3 DRSDS10f-c"] || "") === values.clientPhone &&
    String(cover["undefined_4 DRSDS10f-c"] || "") === values.spousePhone;
  const coverEmployerOk =
    String(cover["2_2 DRSDS10f-c"] || "") === values.clientEmployer &&
    String(cover["2_3 DRSDS10f-c"] || "") === values.spouseEmployer;
  checks.push({
    id: "p1-coversheet-pii",
    title: "Page 1 — Coversheet personal fields mapped to correct labels",
    pass:
      coverChildren &&
      noInterpreter &&
      coverEmailOk &&
      coverDobOk &&
      coverPhoneOk &&
      coverEmployerOk,
    detail: `emailOk=${coverEmailOk}, dobOk=${coverDobOk}, phoneOk=${coverPhoneOk}, employerOk=${coverEmployerOk}, children=${coverChildren}`,
  });

  const sofaValue = String(petition["undefined_49 DRDC15f"] || "");
  const washerValue = String(petition["undefined_50 DRDC15f"] || "");
  const rav4Value = String(petition["undefined_71 DRDC15f"] || "");
  const civicValue = String(petition["undefined_72 DRDC15f"] || "");
  checks.push({
    id: "p4-5-asset-values",
    title: "Pages 4–5 — Household and vehicle dollar values entered",
    pass:
      sofaValue === "1200" &&
      washerValue === "900" &&
      rav4Value === "22000" &&
      civicValue === "14000",
    detail: `sofa=${sofaValue}, washer=${washerValue}, rav4=${rav4Value}, civic=${civicValue}`,
  });

  const debtDesc = String(petition["DESCRIPTION OF DEBT 1 DRDC15f"] || "");
  const debtAmt = String(petition["undefined_86 DRDC15f"] || "");
  const retDesc = String(petition["1_4 DRDC15f"] || "");
  const retVal = String(petition["undefined_64 DRDC15f"] || "");
  checks.push({
    id: "p5-8-amounts",
    title: "Pages 5–8 — Debt Amount Owed and retirement Value in own columns",
    pass:
      debtDesc === "Chase Visa" &&
      debtAmt === "4200" &&
      !debtDesc.includes("$") &&
      retDesc === "401(k)" &&
      retVal === "68000" &&
      !retDesc.includes("$"),
    detail: `debtDesc=${debtDesc}, debtAmt=${debtAmt}, retDesc=${retDesc}, retVal=${retVal}`,
  });

  checks.push({
    id: "p8-pip-not-completed",
    title: "Page 8 — Parent Information Program marked not already completed",
    pass:
      asBool(petition["have DRDC15f"]) === true && asBool(petition["I DRDC15f"]) !== true,
    detail: `haveNot=${asBool(petition["have DRDC15f"])}, haveCompleted=${asBool(petition["I DRDC15f"])}`,
  });

  checks.push({
    id: "p-plan-children-start",
    title: "Parenting plan — child names start on the left of the list",
    pass:
      parenting["Use additional paper if necessary 1 DRCVG11f"] === "Mia L Martinez" &&
      parenting["1 DRCVG11f"] === "Noah J Martinez" &&
      !parenting["2 DRCVG11f"],
    detail: `left=${parenting["Use additional paper if necessary 1 DRCVG11f"]}, right=${parenting["1 DRCVG11f"]}`,
  });

  const noChildren = asBool(petition["There are no children DRDC15f"]) === true;
  checks.push({
    id: "p3-no-children",
    title: "Page 3 — “No children under 18” must NOT be checked",
    pass: !noChildren && values.children.length > 0,
    detail: noChildren
      ? "Still checking “There are no children”."
      : `Unchecked; ${values.children.length} child record(s) present.`,
  });

  const pregA = asBool(petition["Party A is not pregnant DRDC15f"]) === true;
  const pregBNot = asBool(petition["Party B IS NOT pregnant OR DRDC15f"]) === true;
  const pregB = asBool(petition["Party B IS pregnant DRDC15f"]) === true;
  checks.push({
    id: "p4-pregnancy-xor",
    title: "Pages 4–5 — Exactly one pregnancy selection",
    pass: pregA !== pregBNot && (pregA || pregBNot) && !pregB,
    detail: `partyANotPregnant=${pregA}, partyBNotPregnant=${pregBNot}, partyBPregnant=${pregB}`,
  });

  const jointPetition = asBool(petition["Award joint legal decision making authority DRDC15f"]) === true;
  const attachPlan =
    asBool(petition["Provisions for legal decision making and parenting time to be within DRDC15f"]) ===
    true;
  const supportOrdered = asBool(petition["Order that child support will be paid by DRDC15f"]) === true;
  const csoAttached =
    asBool(
      petition["The Child Support Order to be attached to the Decree of Dissolution of Marriage DRDC15f"]
    ) === true;
  const noSpousalRelief = asBool(petition["Do not order spousal maintenance DRDC15f"]) === true;
  const afterDecreeTax = asBool(petition["After judge signs decree DRDC15f"]) === true;
  const debtCutoff = asBool(petition["Hold harmless from debts since parties separation DRDC15f"]) === true;
  const otherExpenses = asBool(petition["Other expenses DRDC15f"]) === true;
  checks.push({
    id: "p11-15-petition-relief",
    title: "Pages 11–15 — Petition relief synced (LDM, support, tax, spousal, debts)",
    pass:
      jointPetition &&
      attachPlan &&
      supportOrdered &&
      csoAttached &&
      noSpousalRelief &&
      afterDecreeTax &&
      debtCutoff &&
      otherExpenses,
    detail: `joint=${jointPetition}, attachPlan=${attachPlan}, support=${supportOrdered}, cso=${csoAttached}, noSpousal=${noSpousalRelief}, taxAfter=${afterDecreeTax}, debtCutoff=${debtCutoff}, otherExpenses=${otherExpenses}`,
  });

  const jointAgree =
    asBool(parenting["3 JOINT LEGAL DECISIONMAKING BY AGREEMENT The parents agree to joint DRCVG11f"]) ===
    true;
  const jointOne = asBool(parenting["4 JOINT DRCVG11f"]) === true;
  checks.push({
    id: "p35-joint-xor",
    title: "Page 35 — Exactly one joint LDM option",
    pass: jointAgree !== jointOne && (jointAgree || jointOne),
    detail: `agreement=${jointAgree}, requestedByOne=${jointOne}`,
  });

  const part4Dv = asBool(
    parenting["Domestic Violence has not occurred between the parties OR DRCVG11f"]
  );
  const part4Dui = asBool(
    parenting[
      "Neither party has been convicted of driving under the influence or a drug offense within the DRCVG11f"
    ]
  );
  checks.push({
    id: "p-part4-joint-only",
    title: "Part 4 — DV and DUI statements only for a joint agreement",
    pass: values.parenting.jointByAgreement !== true ? part4Dv !== true && part4Dui !== true : part4Dv === true && part4Dui === true,
    detail: `jointAgreement=${values.parenting.jointByAgreement}, dvNotOccurred=${part4Dv}, neitherDui=${part4Dui}`,
  });

  const schedA = String(parenting["1_2 DRCVG11f"] || "");
  const schedA2 = String(parenting["2_2 DRCVG11f"] || "");
  const schedB = String(parenting["1_3 DRCVG11f"] || "");
  const schedB2 = String(parenting["2_3 DRCVG11f"] || "");
  const reviewMonths = String(parenting["necessary or desired changes every"] || "");
  const summer =
    asBool(
      parenting[
        "During summer months or school breaks that last longer than 4 days no changes shall be DRCVG11f"
      ]
    ) === true;
  const medical =
    asBool(
      parenting[
        "Both parents will make major medical decisions together except for emergency situations DRCVG11f"
      ]
    ) === true;
  const religious =
    asBool(
      parenting["Both parents agree that religious arrangements are not applicable to this plan DRCVG11f"]
    ) === true;
  checks.push({
    id: "p36-43-parenting-defaults",
    title: "Pages 36–43 — Schedule split + summer/medical/religious/review filled",
    pass:
      Boolean(schedA && schedB && schedA !== schedB) &&
      !/before filing/i.test(`${schedA} ${schedA2} ${schedB} ${schedB2} ${parenting["1_4 DRCVG11f"] || ""}`) &&
      reviewMonths === "12" &&
      summer &&
      medical &&
      religious,
    detail: `schedA=${schedA}, schedB=${schedB}, review=${reviewMonths}, summer=${summer}, medical=${medical}, religious=${religious}`,
  });

  const acquired = asBool(petition["Parties acquired community property DRDC15f"]) === true;
  const hasAssetText = Boolean(
    petition["Real estate located at DRDC15f"] ||
      petition["Make DRDC15f"] ||
      petition["Household furniture and appliances 1 DRDC15f"]
  );
  const debtsChecked = asBool(petition["Parties should divide responsibility DRDC15f"]) === true;
  const hasDebtText = Boolean(petition["DESCRIPTION OF DEBT 1 DRDC15f"]);
  checks.push({
    id: "p5-8-property-tables",
    title: "Pages 5–8 — Community property/debts checked only with itemization",
    pass: acquired === hasAssetText && debtsChecked === hasDebtText && acquired && debtsChecked,
    detail: `propertyChecked=${acquired}, propertyFilled=${hasAssetText}, debtsChecked=${debtsChecked}, debtsFilled=${hasDebtText}`,
  });

  const spouseDob = String(petition["Date of Birth_2 DRDC15f"] || values.spouseDob);
  const marriageDate = String(petition["Date of Marriage DRDC15f"] || values.marriageDate);
  const spouseAgeOk = !issues.some((i) => i.code === "spouse_age_at_marriage");
  checks.push({
    id: "p2-3-dates",
    title: "Pages 2–3 — Respondent age at marriage is plausible",
    pass: spouseAgeOk && Boolean(spouseDob && marriageDate),
    detail: `spouseDob=${spouseDob}, marriageDate=${marriageDate}, validationBlockedImpossibleAge=${!spouseAgeOk}`,
  });

  checks.push({
    id: "p20-injunction",
    title: "Page 20 — Preliminary Injunction party identifiers filled",
    pass: Boolean(injunction["Name DR14f"] && injunction["Date of Birth DR14f"] && injunction["Name_2 DR14f"]),
    detail: `nameA=${injunction["Name DR14f"]}, dobA=${injunction["Date of Birth DR14f"]}, nameB=${injunction["Name_2 DR14f"]}`,
  });

  checks.push({
    id: "p20-injunction-gender",
    title: "Preliminary Injunction — petitioner and respondent gender checked",
    pass:
      asBool(injunction["Male 1 DR14f"]) === true &&
      asBool(injunction["Female 1 DR14f"]) !== true &&
      asBool(injunction["Female 2 DR14f"]) === true &&
      asBool(injunction["Male 2 DR14f"]) !== true,
    detail: `petitionerMale=${asBool(injunction["Male 1 DR14f"])}, respondentFemale=${asBool(injunction["Female 2 DR14f"])}`,
  });

  checks.push({
    id: "p-separate-property-value",
    title: "Separate property dollar value entered and award requested",
    pass:
      String(petition["undefined_74 DRDC15f"] || "") === "15000" &&
      asBool(petition["Award As separate property to A DRDC15f"]) === true &&
      asBool(petition["Award Bs separate property to B DRDC15f"]) !== true,
    detail: `inheritance=${petition["undefined_74 DRDC15f"]}, awardA=${asBool(petition["Award As separate property to A DRDC15f"])}`,
  });

  checks.push({
    id: "p12-paternity-only-if-born-before",
    title: "Paternity for children born before marriage stays blank when none were",
    pass:
      asBool(petition["Party A or_2 DRDC15f"]) !== true &&
      asBool(petition["A minor child or children were born before DRDC15f"]) !== true &&
      !petition["children named below 1 DRDC15f"] &&
      !petition["Current Legal Name 1 DRDC15f"],
    detail: `declareA=${asBool(petition["Party A or_2 DRDC15f"])}, bornBefore=${asBool(petition["A minor child or children were born before DRDC15f"])}`,
  });

  checks.push({
    id: "p15-separation-date",
    title: "Debts-since-separation includes the separation date",
    pass:
      asBool(petition["Hold harmless from debts since parties separation DRDC15f"]) === true &&
      String(petition["the date my spouse was served with the Petition for Dissolution DRDC15f"] || "") ===
        values.separationDate,
    detail: `date=${petition["the date my spouse was served with the Petition for Dissolution DRDC15f"]}`,
  });

  checks.push({
    id: "p5-real-estate",
    title: "Real estate value filled, sale not awarded to Party A, missing deed flagged",
    pass:
      String(petition["undefined_9 DRDC15f"] || "") === "425000" &&
      asBool(petition["A real estate 1 DRDC15f"]) !== true &&
      issues.some((issue) => issue.code === "real_estate_legal_description_missing"),
    detail: `value=${petition["undefined_9 DRDC15f"]}, partyA=${asBool(petition["A real estate 1 DRDC15f"])}`,
  });

  checks.push({
    id: "p-vacation-placement",
    title: "Vacation weeks and notice days sit in the sentence blanks",
    pass:
      String(parenting["children The parents will work out the details of the vacation at least DRCVG11f"] || "") ===
        "2" &&
      String(parenting["undefined_2 DRCVG11f"] || "") === "30" &&
      !parenting["week period of vacation time with the minor DRCVG11f"],
    detail: `weeks=${parenting["children The parents will work out the details of the vacation at least DRCVG11f"]}, days=${parenting["undefined_2 DRCVG11f"]}`,
  });

  checks.push({
    id: "p32-residence-current",
    title: "Residence history shows the current caregiver, not both parents through today",
    pass:
      affidavit["Lived with"] === "Petitioner / Party A" &&
      affidavit["Dates From"] === "2025-09-01" &&
      affidavit["To"] === "present",
    detail: `livedWith=${affidavit["Lived with"]}, from=${affidavit["Dates From"]}, to=${affidavit["To"]}`,
  });

  checks.push({
    id: "p14-tax-both-children",
    title: "Tax rows give both children to each parent in that parent's years",
    pass:
      petition["Name of minor child 1 DRDC15f"] === "Mia L Martinez" &&
      petition["in Tax Year 1 DRDC15f"] === "even yrs" &&
      asBool(petition["Party A_14 DRDC15f"]) === true &&
      petition["Name of minor child 2 DRDC15f"] === "Noah J Martinez" &&
      petition["in Tax Year 2 DRDC15f"] === "even yrs" &&
      petition["Name of minor child 3 DRDC15f"] === "Mia L Martinez" &&
      petition["in Tax Year 3 DRDC15f"] === "odd yrs" &&
      asBool(petition["Party B_15 DRDC15f"]) === true &&
      petition["Name of minor child 4 DRDC15f"] === "Noah J Martinez" &&
      asBool(petition["Pattern shall repeat for subsequent years DRDC15f"]) !== true,
    detail: `y1=${petition["in Tax Year 1 DRDC15f"]}, y2=${petition["in Tax Year 2 DRDC15f"]}, y3=${petition["in Tax Year 3 DRDC15f"]}`,
  });

  checks.push({
    id: "p26-pip-order",
    title: "Page 26 — Parent Information Program Dissolution checked",
    pass: asBool(pipOrder["CDoMr DR12f"]) === true && asBool(pipOrder["R2dLdM DR12f"]) !== true,
    detail: `CDoMr=${asBool(pipOrder["CDoMr DR12f"])}, R2dLdM=${asBool(pipOrder["R2dLdM DR12f"])}`,
  });

  checks.push({
    id: "p33-affidavit-claim",
    title: "Page 33 — Affidavit: no third-party custody claim selected",
    pass: asBool(affidavit["or DRCVG13f"]) === true && Boolean(affidavit["Name"]),
    detail: `noClaim=${asBool(affidavit["or DRCVG13f"])}, childName=${affidavit["Name"]}`,
  });

  console.log("\n=== Generating WC filing PDF ===");
  const result = await generateCaseDocuments(bundle, {
    steps: ["filing"],
    decreePath: "default_decree",
  });
  const outDir = path.join(process.cwd(), "tmp", "test-generated");
  await fs.mkdir(outDir, { recursive: true });
  let outPath = path.join(outDir, result.fileName);
  try {
    await fs.writeFile(outPath, result.pdfBytes);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "EBUSY") throw err;
    outPath = path.join(outDir, result.fileName.replace(/\.pdf$/, "-updated.pdf"));
    await fs.writeFile(outPath, result.pdfBytes);
  }
  console.log("Wrote:", outPath);
  console.log(
    "Forms:",
    result.forms.map((f) => `${f.title} (filled ${f.filled})`).join("; ")
  );

  // Extra sanity: merged PDF should load and expose checkboxes/text.
  const snapshot = await readMergedFieldSnapshot(result.pdfBytes);
  const snapshotKeys = Object.keys(snapshot).length;
  console.log(`Merged PDF AcroForm fields readable: ${snapshotKeys}`);

  console.log("\n=== Audit checklist (test fixture) ===");
  let failed = 0;
  for (const check of checks) {
    const mark = check.pass ? "PASS" : "FAIL";
    if (!check.pass) failed += 1;
    console.log(`[${mark}] ${check.title}`);
    console.log(`       ${check.detail}`);
  }

  console.log(
    failed === 0
      ? "\nAll targeted audit issues look fixed for the test fixture."
      : `\n${failed} check(s) still failing — review details above.`
  );
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
