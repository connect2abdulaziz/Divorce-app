import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { buildCaseFillValues, commonCaptionFields } from "../lib/documents/case-values";
import { buildTestCaseBundle } from "../lib/documents/test-fixture";
import { petitionDrda10Fields, sensitiveDataCoverSheetWocFields } from "../lib/documents/fill-maps";
import { fillAcroFormPdf } from "../lib/documents/fill-acroform";

function checks(form: Awaited<ReturnType<PDFDocument["getForm"]>>) {
  const check = (n: string) => {
    try {
      return form.getCheckBox(n).isChecked();
    } catch {
      return null;
    }
  };
  const text = (n: string) => {
    try {
      return form.getTextField(n).getText();
    } catch {
      return null;
    }
  };
  return { check, text };
}

async function fillFile(relDir: string, needle: RegExp, fields: Record<string, string | boolean>) {
  const file = fs.readdirSync(relDir).find((f) => needle.test(f) && f.endsWith(".pdf"));
  if (!file) throw new Error(`No PDF matching ${needle} in ${relDir}`);
  const raw = fs.readFileSync(path.join(relDir, file));
  const filled = await fillAcroFormPdf(new Uint8Array(raw), fields);
  const pdf = await PDFDocument.load(filled.bytes, { ignoreEncryption: true });
  const form = pdf.getForm();
  const { check, text } = checks(form);
  return {
    file,
    dob: text("Date of Birth DRDA10f") ?? text("Date of Birth MonthDayYear 1 DRSDS10f_An"),
    self: check("Self without a Lawyer") ?? check("Self without a Lawyer OR"),
    attorney: check("Attorney for"),
    petitioner: check("Petitioner") ?? check("Petitioner OR"),
    respondent: check("Respondent"),
    conciliation: check("Conciliation Services would not work DRDA10f"),
    i90: check("I have lived in AZ for 90 days DRDA10f"),
    spouse90: check("My spouse lived in AZ for 90 days DRDA10f"),
  };
}

async function main() {
  const v = buildCaseFillValues(buildTestCaseBundle());
  const dir = "Divorce WOC/1 Petition Divorce WO 1st step";
  const petition = await fillFile(dir, /petition/i, petitionDrda10Fields(v));
  const creditors = await fillFile(dir, /creditor/i, commonCaptionFields(v));
  const cover = await fillFile(dir, /sensitive|drsds/i, sensitiveDataCoverSheetWocFields(v)).catch(
    async () => {
      // Cover sheet may live in a sibling folder naming variant.
      const alt = fs
        .readdirSync("Divorce WOC", { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => path.join("Divorce WOC", d.name));
      for (const d of alt) {
        try {
          return await fillFile(d, /sensitive|drsds/i, sensitiveDataCoverSheetWocFields(v));
        } catch {
          // try next
        }
      }
      return { file: "missing", error: true };
    }
  );
  console.log(JSON.stringify({ petition, creditors, cover }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
