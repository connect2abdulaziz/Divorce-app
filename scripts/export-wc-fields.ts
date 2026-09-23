import { promises as fs } from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

const ROOT = path.resolve("Divorce WC");
const OUT = path.resolve("lib/documents/wc-field-inventory.json");

async function listPdfs(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listPdfs(full)));
    else if (e.name.toLowerCase().endsWith(".pdf")) out.push(full);
  }
  return out;
}

function fieldType(ctor: string) {
  if (ctor.includes("Text")) return "text";
  if (ctor.includes("Check")) return "checkbox";
  if (ctor.includes("Radio")) return "radio";
  if (ctor.includes("Dropdown") || ctor.includes("Option")) return "dropdown";
  return ctor.replace(/^PDF/, "").toLowerCase() || "unknown";
}

async function main() {
  const files = (await listPdfs(ROOT)).sort();
  const templates = [];
  for (const f of files) {
    const relativePath = path.relative(ROOT, f).split(path.sep).join("/");
    const buf = await fs.readFile(f);
    const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
    const fields = pdf.getForm().getFields().map((field) => ({
      name: field.getName(),
      type: fieldType(field.constructor.name),
    }));
    templates.push({
      relativePath,
      fileName: path.basename(f),
      pageCount: pdf.getPageCount(),
      fieldCount: fields.length,
      fields,
    });
  }
  const report = {
    scannedAt: new Date().toISOString(),
    root: ROOT,
    track: "with_children",
    summary: {
      pdfCount: templates.length,
      fillable: templates.filter((t) => t.fieldCount > 0).length,
      totalFields: templates.reduce((n, t) => n + t.fieldCount, 0),
    },
    templates,
  };
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log(`Wrote ${OUT} (${report.summary.pdfCount} PDFs, ${report.summary.totalFields} fields)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
