import { promises as fs } from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

const ROOT = path.resolve("Divorce WOC");
const OUT = path.resolve("lib/documents/woc-scan-result.txt");

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
  const files = await listPdfs(ROOT);
  let fillable = 0;
  let flat = 0;
  let errors = 0;
  const lines: string[] = [];

  for (const f of files) {
    const rel = path.relative(ROOT, f);
    try {
      const buf = await fs.readFile(f);
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      const fields = pdf.getForm().getFields();
      if (fields.length === 0) {
        flat++;
        lines.push(`FLAT | ${rel}`);
      } else {
        fillable++;
        const types = [...new Set(fields.map((x) => fieldType(x.constructor.name)))].join(",");
        lines.push(`ACRO | ${fields.length} fields (${types}) | ${rel}`);
        for (const field of fields.slice(0, 20)) {
          lines.push(`       - ${field.getName()} [${fieldType(field.constructor.name)}]`);
        }
        if (fields.length > 20) lines.push(`       ... +${fields.length - 20} more`);
      }
    } catch (e) {
      errors++;
      lines.push(`ERR  | ${rel} | ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const summary = [
    `ROOT: ${ROOT}`,
    `PDF count: ${files.length}`,
    `AcroForm (fillable): ${fillable}`,
    `Flat: ${flat}`,
    `Errors: ${errors}`,
    "",
    ...lines,
  ].join("\n");

  await fs.writeFile(OUT, summary, "utf8");
  console.log(summary);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
