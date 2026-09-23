import { existsSync } from "fs";
import path from "path";
import { DOCUMENT_TEMPLATES, selectDocumentPack } from "../lib/documents/catalog";
import { WC_TEMPLATE_ROOT, WOC_TEMPLATE_ROOT } from "../lib/documents/paths";

function missingOnDisk(trackRoot: string, track: "with_children" | "without_children") {
  return DOCUMENT_TEMPLATES.filter((t) => t.track === track).filter((t) => {
    const abs = path.join(trackRoot, ...t.relativePath.split("/"));
    return !existsSync(abs);
  });
}

const wocMissing = missingOnDisk(WOC_TEMPLATE_ROOT, "without_children");
const wcMissing = missingOnDisk(WC_TEMPLATE_ROOT, "with_children");

console.log("catalog templates:", DOCUMENT_TEMPLATES.length);
console.log("WOC missing on disk:", wocMissing.length);
for (const m of wocMissing.slice(0, 10)) console.log(" ", m.relativePath);
console.log("WC missing on disk:", wcMissing.length);
for (const m of wcMissing.slice(0, 10)) console.log(" ", m.relativePath);

const w = selectDocumentPack({
  hasCommonChildren: false,
  decreePath: "default_decree",
  steps: ["filing", "service", "default", "decree"],
});
const c = selectDocumentPack({
  hasCommonChildren: true,
  decreePath: "consent_decree",
  steps: ["filing", "service", "default", "decree"],
});
console.log("without+default:", w.templates.length, "forms");
console.log("with+consent:", c.templates.length, "forms");
