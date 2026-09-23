import { PDFDocument, type PDFForm } from "pdf-lib";

function trySetText(form: PDFForm, name: string, value: string) {
  try {
    form.getTextField(name).setText(value);
    return true;
  } catch {
    return false;
  }
}

function trySetCheck(form: PDFForm, name: string, checked: boolean) {
  try {
    const box = form.getCheckBox(name);
    if (checked) box.check();
    else box.uncheck();
    return true;
  } catch {
    return false;
  }
}

/**
 * Fill an AcroForm PDF. Unknown field names are skipped.
 * Returns counts for logging / UI.
 */
export async function fillAcroFormPdf(
  templateBytes: Uint8Array,
  fields: Record<string, string | boolean>
): Promise<{ bytes: Uint8Array; filled: number; skipped: number }> {
  const pdf = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
  const form = pdf.getForm();
  let filled = 0;
  let skipped = 0;

  for (const [name, value] of Object.entries(fields)) {
    if (typeof value === "boolean") {
      if (trySetCheck(form, name, value)) filled++;
      else skipped++;
    } else if (value === "") {
      skipped++;
    } else if (trySetText(form, name, value)) {
      filled++;
    } else {
      skipped++;
    }
  }

  // Keep fields editable so staff can correct before filing.
  const bytes = await pdf.save({ updateFieldAppearances: true });
  return { bytes, filled, skipped };
}

export async function mergePdfs(parts: Uint8Array[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const part of parts) {
    const doc = await PDFDocument.load(part, { ignoreEncryption: true });
    const pages = await out.copyPages(doc, doc.getPageIndices());
    for (const page of pages) out.addPage(page);
  }
  return out.save();
}
