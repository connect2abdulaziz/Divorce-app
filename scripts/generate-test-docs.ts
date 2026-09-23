/**
 * Generate filled filing packets using sample questionnaire data.
 *
 *   npx tsx scripts/generate-test-docs.ts          # both WOC + WC
 *   npx tsx scripts/generate-test-docs.ts woc
 *   npx tsx scripts/generate-test-docs.ts wc
 *
 * Writes PDFs to tmp/test-generated/
 */
import { promises as fs } from "fs";
import path from "path";
import { generateCaseDocuments } from "../lib/documents/generate";
import {
  buildTestCaseBundle,
  buildTestCaseBundleWithChildren,
} from "../lib/documents/test-fixture";

async function generateOne(label: string, withChildren: boolean) {
  const bundle = withChildren ? buildTestCaseBundleWithChildren() : buildTestCaseBundle();
  console.log(`\nGenerating ${label} filing packet for Jordan Martinez…`);

  const result = await generateCaseDocuments(bundle, {
    steps: ["filing"],
    decreePath: "default_decree",
  });

  const outDir = path.join(process.cwd(), "tmp", "test-generated");
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, result.fileName);
  await fs.writeFile(outPath, result.pdfBytes);

  console.log(`Wrote: ${outPath}`);
  console.log(`Track: ${result.track}`);
  console.log(`Forms (${result.forms.length}):`);
  for (const f of result.forms) {
    console.log(`  - ${f.formCode ?? "—"} ${f.title}  (filled ${f.filled}, skipped ${f.skipped})`);
  }
  return outPath;
}

async function main() {
  const arg = (process.argv[2] || "both").toLowerCase();
  const paths: string[] = [];

  if (arg === "woc" || arg === "both") {
    paths.push(await generateOne("WOC (without children)", false));
  }
  if (arg === "wc" || arg === "both") {
    paths.push(await generateOne("WC (with children)", true));
  }
  if (!paths.length) {
    console.error('Usage: npx tsx scripts/generate-test-docs.ts [woc|wc|both]');
    process.exit(1);
  }

  console.log("\nOpen the PDF(s) to verify AcroForm fields.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
