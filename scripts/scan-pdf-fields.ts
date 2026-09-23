/**
 * Phase 1 helper: scan Arizona court PDF templates for AcroForm fields.
 *
 * Usage:
 *   npx tsx scripts/scan-pdf-fields.ts
 *
 * Reads from DOCUMENT_TEMPLATE_ROOT (or the default Divorce ALL PDFS path)
 * and writes lib/documents/field-inventory.json
 */
import { promises as fs } from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

const DEFAULT_ROOT =
  "C:\\xampp\\htdocs\\azdivorce\\wp-content\\uploads\\Divorce ALL PDFS";

const ROOT = process.env.DOCUMENT_TEMPLATE_ROOT || DEFAULT_ROOT;
const OUT = path.join(process.cwd(), "lib", "documents", "field-inventory.json");

type TemplateScan = {
  relativePath: string;
  fileName: string;
  bytes: number;
  pageCount: number;
  isFillable: boolean;
  fieldCount: number;
  fields: { name: string; type: string }[];
  error?: string;
};

async function listPdfs(dir: string, base = dir): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await listPdfs(full, base)));
    } else if (e.isFile() && e.name.toLowerCase().endsWith(".pdf")) {
      out.push(full);
    }
  }
  return out;
}

function fieldTypeLabel(ctorName: string): string {
  if (ctorName.includes("Text")) return "text";
  if (ctorName.includes("Check")) return "checkbox";
  if (ctorName.includes("Radio")) return "radio";
  if (ctorName.includes("Dropdown") || ctorName.includes("Option")) return "dropdown";
  if (ctorName.includes("Button")) return "button";
  if (ctorName.includes("Signature")) return "signature";
  return ctorName.replace(/^PDF/, "").toLowerCase() || "unknown";
}

async function scanOne(filePath: string, root: string): Promise<TemplateScan> {
  const relativePath = path.relative(root, filePath).split(path.sep).join("/");
  const fileName = path.basename(filePath);
  const buf = await fs.readFile(filePath);
  try {
    const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
    const form = pdf.getForm();
    const fields = form.getFields().map((f) => ({
      name: f.getName(),
      type: fieldTypeLabel(f.constructor.name),
    }));
    return {
      relativePath,
      fileName,
      bytes: buf.byteLength,
      pageCount: pdf.getPageCount(),
      isFillable: fields.length > 0,
      fieldCount: fields.length,
      fields,
    };
  } catch (err) {
    return {
      relativePath,
      fileName,
      bytes: buf.byteLength,
      pageCount: 0,
      isFillable: false,
      fieldCount: 0,
      fields: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main() {
  const root = path.resolve(ROOT);
  console.log("Scanning:", root);
  const files = await listPdfs(root);
  console.log(`Found ${files.length} PDFs`);

  const templates: TemplateScan[] = [];
  for (const f of files) {
    const scan = await scanOne(f, root);
    templates.push(scan);
    const mark = scan.error ? "ERR" : scan.isFillable ? `${scan.fieldCount} fields` : "flat";
    console.log(`  ${scan.relativePath} → ${mark}`);
  }

  templates.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const fillable = templates.filter((t) => t.isFillable).length;
  const flat = templates.filter((t) => !t.isFillable && !t.error).length;
  const errors = templates.filter((t) => t.error).length;
  const allFieldNames = [
    ...new Set(templates.flatMap((t) => t.fields.map((f) => f.name))),
  ].sort();

  const report = {
    scannedAt: new Date().toISOString(),
    root,
    summary: {
      pdfCount: templates.length,
      fillable,
      flat,
      errors,
      uniqueFieldNameCount: allFieldNames.length,
    },
    templates,
    allFieldNames,
  };

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log(`\nWrote ${OUT}`);
  console.log(
    `Summary: ${templates.length} PDFs · ${fillable} fillable · ${flat} flat · ${errors} errors · ${allFieldNames.length} unique field names`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
