/**
 * Generate WOC + WC packets and verify QA issues #1–#6.
 *   npx tsx scripts/verify-qa-six.ts
 */
import { promises as fs } from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import {
  buildTestCaseBundle,
  buildTestCaseBundleWithChildren,
} from "../lib/documents/test-fixture";
import { buildCaseFillValues, commonCaptionFields, type CaseBundle } from "../lib/documents/case-values";
import {
  petitionDrda10Fields,
  petitionDrdc15Fields,
  preliminaryInjunctionFields,
  sensitiveDataCoverSheetWocFields,
  sensitiveDataCoverSheetWcFields,
} from "../lib/documents/fill-maps";
import { generateCaseDocuments } from "../lib/documents/generate";
import { fillAcroFormPdf } from "../lib/documents/fill-acroform";
import { templateRootForTrack } from "../lib/documents/paths";

type Check = { id: string; pass: boolean; detail: string };

function bool(v: unknown) {
  return v === true;
}

function cloneBundle(b: CaseBundle): CaseBundle {
  return JSON.parse(JSON.stringify(b)) as CaseBundle;
}

async function readChecks(
  templateRel: string,
  track: "with_children" | "without_children",
  fields: Record<string, string | boolean>,
  names: string[]
): Promise<Record<string, string | boolean | null>> {
  const abs = path.join(templateRootForTrack(track), ...templateRel.split("/"));
  const raw = await fs.readFile(abs);
  const filled = await fillAcroFormPdf(new Uint8Array(raw), fields);
  const pdf = await PDFDocument.load(filled.bytes, { ignoreEncryption: true });
  const form = pdf.getForm();
  const out: Record<string, string | boolean | null> = {};
  for (const name of names) {
    try {
      out[name] = form.getCheckBox(name).isChecked();
      continue;
    } catch {
      /* not checkbox */
    }
    try {
      out[name] = form.getTextField(name).getText() ?? "";
      continue;
    } catch {
      out[name] = null;
    }
  }
  return out;
}

function runMapChecks(label: string, bundle: CaseBundle): Check[] {
  const v = buildCaseFillValues(bundle);
  const caption = commonCaptionFields(v);
  const cover =
    bundle.gates.hasCommonChildren === true
      ? sensitiveDataCoverSheetWcFields(v)
      : sensitiveDataCoverSheetWocFields(v);
  const petition =
    bundle.gates.hasCommonChildren === true ? petitionDrdc15Fields(v) : petitionDrda10Fields(v);
  const injunction = preliminaryInjunctionFields(v);
  const checks: Check[] = [];

  // #1 Court texts
  if (bundle.gates.hasCommonChildren) {
    checks.push({
      id: `${label}/#1-texts-A-no`,
      pass: bool(cover["No texts DRSDS10f-c"]) && !bool(cover["Yes DRSDS10f-c"]),
      detail: `No=${cover["No texts DRSDS10f-c"]} Yes=${cover["Yes DRSDS10f-c"]}`,
    });
    checks.push({
      id: `${label}/#1-texts-B-no`,
      pass: bool(cover["No texts_2 DRSDS10f-c"]) && !bool(cover["Yes_2 DRSDS10f-c"]),
      detail: `No=${cover["No texts_2 DRSDS10f-c"]} Yes=${cover["Yes_2 DRSDS10f-c"]}`,
    });
  } else {
    checks.push({
      id: `${label}/#1-texts-A-no`,
      pass: bool(cover["No texts DRSDS10f_Ann"]) && !bool(cover["Yes DRSDS10f_Ann"]),
      detail: `No=${cover["No texts DRSDS10f_Ann"]} Yes=${cover["Yes DRSDS10f_Ann"]}`,
    });
    checks.push({
      id: `${label}/#1-texts-B-no`,
      pass: bool(cover["No texts_2 DRSDS10f_Ann"]) && !bool(cover["Yes_2 DRSDS10f_Ann"]),
      detail: `No=${cover["No texts_2 DRSDS10f_Ann"]} Yes=${cover["Yes_2 DRSDS10f_Ann"]}`,
    });
  }

  // #2 Representing
  checks.push({
    id: `${label}/#2-self`,
    pass:
      bool(caption["Self without a Lawyer"]) ||
      bool(caption["Self without a Lawyer OR"]) ||
      bool(caption["Self without a Lawyer or"]),
    detail: `Self=${caption["Self without a Lawyer"]} OR=${caption["Self without a Lawyer OR"]}`,
  });
  checks.push({
    id: `${label}/#2-petitioner`,
    pass: bool(caption.Petitioner) || bool(caption["Petitioner OR"]) || bool(caption["Petitioner or"]),
    detail: `Petitioner=${caption.Petitioner} OR=${caption["Petitioner OR"]}`,
  });
  checks.push({
    id: `${label}/#2-not-attorney`,
    pass: caption["Attorney for"] === false,
    detail: `Attorney for=${caption["Attorney for"]}`,
  });
  checks.push({
    id: `${label}/#2-not-respondent`,
    pass: caption.Respondent === false,
    detail: `Respondent=${caption.Respondent}`,
  });

  // #3 Interpreter
  if (bundle.gates.hasCommonChildren) {
    checks.push({
      id: `${label}/#3-interpreter-no`,
      pass:
        bool(cover["No interpreter12 DRSDS10f-c"]) &&
        !bool(cover["Interpreter needed yes_10 DRSDS10f-c"]),
      detail: `No=${cover["No interpreter12 DRSDS10f-c"]} Yes=${cover["Interpreter needed yes_10 DRSDS10f-c"]}`,
    });
  } else {
    checks.push({
      id: `${label}/#3-interpreter-no`,
      pass: bool(cover["No DRSDS10f_Ann"]) && !bool(cover["Yes_3 DRSDS10f_Ann"]),
      detail: `No=${cover["No DRSDS10f_Ann"]} Yes=${cover["Yes_3 DRSDS10f_Ann"]}`,
    });
  }

  // #4 Mortgage not raw in first legal line (WOC petition only)
  if (!bundle.gates.hasCommonChildren) {
    const legal0 = String(petition["undefined_5 DRDA10f"] || "");
    const legal1 = String(petition["Legal Description 1 DRDA10f"] || "");
    const legal2 = String(petition["Legal Description 2 DRDA10f"] || "");
    const all = `${legal0} ${legal1} ${legal2}`;
    checks.push({
      id: `${label}/#4-legal-first-is-deed`,
      pass: /lot|block|camelback|maps|county/i.test(legal0) && legal0 !== "310000",
      detail: `legal0=${legal0}`,
    });
    checks.push({
      id: `${label}/#4-mortgage-as-note`,
      pass: /mortgage|310000/i.test(all) && !/^310000$/.test(legal0.trim()),
      detail: `all=${all}`,
    });
    checks.push({
      id: `${label}/#4-sell-present`,
      pass: /sell/i.test(all),
      detail: `legal1=${legal1}`,
    });
  }

  // #5 Pregnancy XOR — husband petitioner, wife not pregnant → only Party B
  if (!bundle.gates.hasCommonChildren) {
    checks.push({
      id: `${label}/#5-preg-only-B`,
      pass:
        bool(petition["Party B IS NOT pregnant OR DRDA10f"]) &&
        !bool(petition["Party A not pregnant DRDA10f"]) &&
        !bool(petition["Party A is pregnant DRDA10f"]) &&
        !bool(petition["Party B IS pregnant DRDA10f"]),
      detail: `Anot=${petition["Party A not pregnant DRDA10f"]} Bnot=${petition["Party B IS NOT pregnant OR DRDA10f"]}`,
    });
  } else {
    checks.push({
      id: `${label}/#5-preg-only-B`,
      pass:
        bool(petition["Party B IS NOT pregnant OR DRDC15f"]) &&
        !bool(petition["Party A is not pregnant DRDC15f"]) &&
        !bool(petition["Party B IS pregnant DRDC15f"]),
      detail: `Anot=${petition["Party A is not pregnant DRDC15f"]} Bnot=${petition["Party B IS NOT pregnant OR DRDC15f"]}`,
    });
  }

  // #6 Driver license
  checks.push({
    id: `${label}/#6-dl-client`,
    pass: String(injunction["Drivers License last 4 nos DR14f"] || "") === "4826",
    detail: `A=${injunction["Drivers License last 4 nos DR14f"]}`,
  });
  checks.push({
    id: `${label}/#6-dl-spouse`,
    pass: String(injunction["Drivers License last 4 nos_2 DR14f"] || "") === "7391",
    detail: `B=${injunction["Drivers License last 4 nos_2 DR14f"]}`,
  });

  return checks;
}

async function runYesVariants(): Promise<Check[]> {
  const bundle = cloneBundle(buildTestCaseBundle());
  const client = bundle.sections.party_client as Record<string, unknown>;
  client.court_texts_opt_in = true;
  client.interpreter_needed = true;
  client.interpreter_language = "Spanish";
  const spouse = bundle.sections.party_spouse as Record<string, unknown>;
  spouse.court_texts_opt_in = true;

  const cover = sensitiveDataCoverSheetWocFields(buildCaseFillValues(bundle));
  return [
    {
      id: "WOC-yes-variant/#1-texts-A-yes",
      pass: bool(cover["Yes DRSDS10f_Ann"]) && !bool(cover["No texts DRSDS10f_Ann"]),
      detail: `Yes=${cover["Yes DRSDS10f_Ann"]} No=${cover["No texts DRSDS10f_Ann"]}`,
    },
    {
      id: "WOC-yes-variant/#1-texts-B-yes",
      pass: bool(cover["Yes_2 DRSDS10f_Ann"]) && !bool(cover["No texts_2 DRSDS10f_Ann"]),
      detail: `Yes=${cover["Yes_2 DRSDS10f_Ann"]} No=${cover["No texts_2 DRSDS10f_Ann"]}`,
    },
    {
      id: "WOC-yes-variant/#3-interpreter-yes",
      pass:
        bool(cover["Yes_3 DRSDS10f_Ann"]) &&
        !bool(cover["No DRSDS10f_Ann"]) &&
        cover["What language DRSDS10f_Ann"] === "Spanish",
      detail: `Yes=${cover["Yes_3 DRSDS10f_Ann"]} lang=${cover["What language DRSDS10f_Ann"]}`,
    },
  ];
}

async function pdfSpotCheck(bundle: CaseBundle): Promise<Check[]> {
  const v = buildCaseFillValues(bundle);
  const cover = sensitiveDataCoverSheetWocFields(v);
  const petition = petitionDrda10Fields(v);
  const injunction = preliminaryInjunctionFields(v);
  const caption = commonCaptionFields(v);

  // Sensitive data cover sheet path from catalog naming convention
  const coverPdf = await readChecks(
    "1 Dissolution of Marriage without Children Packet 1st Step/Sensitive Data Cover Sheet with children - drsds10f-A.pdf",
    "without_children",
    cover,
    [
      "No texts DRSDS10f_Ann",
      "Yes DRSDS10f_Ann",
      "No texts_2 DRSDS10f_Ann",
      "Yes_2 DRSDS10f_Ann",
      "No DRSDS10f_Ann",
      "Yes_3 DRSDS10f_Ann",
      "What language DRSDS10f_Ann",
      "Self without a Lawyer",
      "Attorney for",
      "Petitioner",
      "Respondent",
    ]
  ).catch(async () => {
    // Fallback: try alternate filename patterns by listing
    return null;
  });

  const checks: Check[] = [];
  if (coverPdf) {
    checks.push({
      id: "PDF-cover/#1-no-texts",
      pass: coverPdf["No texts DRSDS10f_Ann"] === true && coverPdf["Yes DRSDS10f_Ann"] !== true,
      detail: JSON.stringify({
        noA: coverPdf["No texts DRSDS10f_Ann"],
        yesA: coverPdf["Yes DRSDS10f_Ann"],
      }),
    });
    checks.push({
      id: "PDF-cover/#2-representing",
      pass:
        (coverPdf["Self without a Lawyer"] === true || coverPdf["Petitioner"] === true) &&
        coverPdf["Attorney for"] !== true &&
        coverPdf["Respondent"] !== true,
      detail: JSON.stringify({
        self: coverPdf["Self without a Lawyer"],
        attorney: coverPdf["Attorney for"],
        petitioner: coverPdf["Petitioner"],
        respondent: coverPdf["Respondent"],
      }),
    });
    checks.push({
      id: "PDF-cover/#3-interpreter-no",
      pass: coverPdf["No DRSDS10f_Ann"] === true && coverPdf["Yes_3 DRSDS10f_Ann"] !== true,
      detail: JSON.stringify({
        no: coverPdf["No DRSDS10f_Ann"],
        yes: coverPdf["Yes_3 DRSDS10f_Ann"],
      }),
    });
  } else {
    checks.push({
      id: "PDF-cover/template-path",
      pass: false,
      detail: "Could not load WOC sensitive-data template for PDF spot-check; map checks still run.",
    });
  }

  // Petition RE fields via fill map already checked; try petition template if present.
  void petition;
  void injunction;
  void caption;
  return checks;
}

async function findTemplate(track: "without_children" | "with_children", needle: RegExp) {
  const root = templateRootForTrack(track);
  async function walk(dir: string): Promise<string | null> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        const hit = await walk(full);
        if (hit) return hit;
      } else if (needle.test(e.name)) {
        return full;
      }
    }
    return null;
  }
  return walk(root);
}

async function pdfSpotCheckRobust(bundle: CaseBundle): Promise<Check[]> {
  const v = buildCaseFillValues(bundle);
  const coverFields = sensitiveDataCoverSheetWocFields(v);
  const petitionFields = petitionDrda10Fields(v);
  const injunctionFields = preliminaryInjunctionFields(v);
  const checks: Check[] = [];

  const coverPath = await findTemplate("without_children", /drsds10f/i);
  if (coverPath) {
    const raw = await fs.readFile(coverPath);
    const filled = await fillAcroFormPdf(new Uint8Array(raw), coverFields);
    const pdf = await PDFDocument.load(filled.bytes, { ignoreEncryption: true });
    const form = pdf.getForm();
    const getCheck = (name: string) => {
      try {
        return form.getCheckBox(name).isChecked();
      } catch {
        return null;
      }
    };
    const self =
      getCheck("Self without a Lawyer") ??
      getCheck("Self without a Lawyer OR") ??
      getCheck("Self without a Lawyer or");
    const attorney = getCheck("Attorney for");
    const petitioner = getCheck("Petitioner") ?? getCheck("Petitioner OR") ?? getCheck("Petitioner or");
    const respondent = getCheck("Respondent");
    checks.push({
      id: "PDF-cover/#1-texts",
      pass: getCheck("No texts DRSDS10f_Ann") === true && getCheck("Yes DRSDS10f_Ann") !== true,
      detail: `No=${getCheck("No texts DRSDS10f_Ann")} Yes=${getCheck("Yes DRSDS10f_Ann")} file=${path.basename(coverPath)}`,
    });
    checks.push({
      id: "PDF-cover/#2-representing",
      pass: self === true && attorney !== true && petitioner === true && respondent !== true,
      detail: `self=${self} attorney=${attorney} petitioner=${petitioner} respondent=${respondent}`,
    });
    checks.push({
      id: "PDF-cover/#3-interpreter",
      pass: getCheck("No DRSDS10f_Ann") === true && getCheck("Yes_3 DRSDS10f_Ann") !== true,
      detail: `No=${getCheck("No DRSDS10f_Ann")} Yes=${getCheck("Yes_3 DRSDS10f_Ann")}`,
    });
  } else {
    checks.push({ id: "PDF-cover/missing", pass: false, detail: "No drsds10f template found" });
  }

  const petitionPath = await findTemplate("without_children", /drda10f/i);
  if (petitionPath) {
    const raw = await fs.readFile(petitionPath);
    const filled = await fillAcroFormPdf(new Uint8Array(raw), petitionFields);
    const pdf = await PDFDocument.load(filled.bytes, { ignoreEncryption: true });
    const form = pdf.getForm();
    const getText = (name: string) => {
      try {
        return form.getTextField(name).getText() ?? "";
      } catch {
        return "";
      }
    };
    const getCheck = (name: string) => {
      try {
        return form.getCheckBox(name).isChecked();
      } catch {
        return null;
      }
    };
    const legal0 = getText("undefined_5 DRDA10f");
    const legal1 = getText("Legal Description 1 DRDA10f");
    const legal2 = getText("Legal Description 2 DRDA10f");
    checks.push({
      id: "PDF-petition/#4-legal",
      pass: /lot|block|camelback/i.test(legal0) && legal0.trim() !== "310000",
      detail: `legal0=${legal0} | ${legal1} | ${legal2}`,
    });
    checks.push({
      id: "PDF-petition/#5-pregnancy",
      pass:
        getCheck("Party B IS NOT pregnant OR DRDA10f") === true &&
        getCheck("Party A not pregnant DRDA10f") !== true,
      detail: `B=${getCheck("Party B IS NOT pregnant OR DRDA10f")} A=${getCheck("Party A not pregnant DRDA10f")}`,
    });
  } else {
    checks.push({ id: "PDF-petition/missing", pass: false, detail: "No drda10f template found" });
  }

  const injPath = await findTemplate("without_children", /dr14f|preliminary/i);
  if (injPath) {
    const raw = await fs.readFile(injPath);
    const filled = await fillAcroFormPdf(new Uint8Array(raw), injunctionFields);
    const pdf = await PDFDocument.load(filled.bytes, { ignoreEncryption: true });
    const form = pdf.getForm();
    const getText = (name: string) => {
      try {
        return form.getTextField(name).getText() ?? "";
      } catch {
        return "";
      }
    };
    checks.push({
      id: "PDF-injunction/#6-dl",
      pass:
        getText("Drivers License last 4 nos DR14f") === "4826" &&
        getText("Drivers License last 4 nos_2 DR14f") === "7391",
      detail: `A=${getText("Drivers License last 4 nos DR14f")} B=${getText("Drivers License last 4 nos_2 DR14f")} file=${path.basename(injPath)}`,
    });
  } else {
    checks.push({ id: "PDF-injunction/missing", pass: false, detail: "No DR14f template found" });
  }

  return checks;
}

async function main() {
  const all: Check[] = [];

  console.log("=== Fill-map checks (WOC + WC fixtures) ===");
  all.push(...runMapChecks("WOC", buildTestCaseBundle()));
  all.push(...runMapChecks("WC", buildTestCaseBundleWithChildren()));
  all.push(...(await runYesVariants()));

  console.log("\n=== Generating full packets ===");
  const outDir = path.join(process.cwd(), "tmp", "test-generated");
  await fs.mkdir(outDir, { recursive: true });

  for (const [label, bundle] of [
    ["WOC", buildTestCaseBundle()],
    ["WC", buildTestCaseBundleWithChildren()],
  ] as const) {
    const result = await generateCaseDocuments(bundle, {
      steps: ["filing"],
      decreePath: "default_decree",
    });
    const outPath = path.join(outDir, result.fileName);
    await fs.writeFile(outPath, result.pdfBytes);
    console.log(`Wrote ${outPath} (${result.forms.length} forms)`);
  }

  console.log("\n=== PDF AcroForm spot-checks (WOC templates) ===");
  all.push(...(await pdfSpotCheckRobust(buildTestCaseBundle())));
  // keep unused helper referenced for clarity
  void pdfSpotCheck;

  console.log("\n=== Results ===");
  let failed = 0;
  for (const c of all) {
    const mark = c.pass ? "PASS" : "FAIL";
    if (!c.pass) failed++;
    console.log(`${mark}  ${c.id}  — ${c.detail}`);
  }
  console.log(`\n${all.length - failed}/${all.length} passed`);
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
