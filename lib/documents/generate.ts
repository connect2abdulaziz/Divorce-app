import { promises as fs } from "fs";
import path from "path";
import { selectDocumentPack, type DecreePath, type PackStep } from "./catalog";
import { buildCaseFillValues } from "./case-values";
import { fieldsForTemplate } from "./fill-maps";
import { fillAcroFormPdf, mergePdfs } from "./fill-acroform";
import { templateRootForTrack } from "./paths";
import type { loadCaseBundle } from "@/lib/questionnaire/data";

export type GenerateOptions = {
  decreePath?: DecreePath;
  /** Default: filing packet only. Use full court pipeline when needed. */
  steps?: PackStep[];
  includeOptional?: boolean;
};

export type GenerateResult = {
  track: "with_children" | "without_children";
  decreePath: DecreePath;
  fileName: string;
  pdfBytes: Uint8Array;
  forms: { id: string; title: string; formCode: string | null; filled: number; skipped: number }[];
};

export async function generateCaseDocuments(
  bundle: Awaited<ReturnType<typeof loadCaseBundle>>,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const pack = selectDocumentPack({
    hasCommonChildren: bundle.gates.hasCommonChildren,
    decreePath: options.decreePath ?? "default_decree",
    steps: options.steps ?? ["filing"],
    includeOptional: options.includeOptional ?? false,
  });

  if (pack.templates.length === 0) {
    throw new Error("No templates selected for this case.");
  }

  const root = templateRootForTrack(pack.track);
  const values = buildCaseFillValues(bundle);
  const filledParts: Uint8Array[] = [];
  const forms: GenerateResult["forms"] = [];

  for (const tpl of pack.templates) {
    const abs = path.join(root, ...tpl.relativePath.split("/"));
    const raw = await fs.readFile(abs);
    const map = fieldsForTemplate(tpl.id, values);
    const result = await fillAcroFormPdf(new Uint8Array(raw), map);
    filledParts.push(result.bytes);
    forms.push({
      id: tpl.id,
      title: tpl.title,
      formCode: tpl.formCode,
      filled: result.filled,
      skipped: result.skipped,
    });
  }

  const pdfBytes = await mergePdfs(filledParts);
  const party = bundle.sections.party_client as { last_name?: string | null } | null;
  const last = (party?.last_name || "case").replace(/[^a-zA-Z0-9_-]+/g, "_");
  const stamp = new Date().toISOString().slice(0, 10);
  const fileName = `divorce-docs-${last}-${pack.track === "with_children" ? "WC" : "WOC"}-${stamp}.pdf`;

  return {
    track: pack.track,
    decreePath: pack.decreePath,
    fileName,
    pdfBytes,
    forms,
  };
}
