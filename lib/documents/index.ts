export {
  DOCUMENT_TEMPLATES,
  resolveTrack,
  selectDocumentPack,
  getTemplateById,
  type CaseTrack,
  type DecreePath,
  type PackStep,
  type DocumentTemplate,
  type DocumentPack,
  type PackSelectionInput,
} from "./catalog";

export { WOC_TEMPLATE_ROOT, WC_TEMPLATE_ROOT, isWcPackAvailable, templateRootForTrack } from "./paths";
export { generateCaseDocuments, type GenerateOptions, type GenerateResult } from "./generate";
export { MERGE_SLOTS, mergeSlotsForForm, type MergeSlot } from "./merge-slots";

import wocInventory from "./woc-field-inventory.json";
import wcInventory from "./wc-field-inventory.json";
import { isWcPackAvailable } from "./paths";

export const WOC_FIELD_INVENTORY = wocInventory;
export const WC_FIELD_INVENTORY = wcInventory;

export function getFieldInventorySummary() {
  const wcReady = isWcPackAvailable();
  return {
    pdfCount: wocInventory.summary.pdfCount + (wcReady ? wcInventory.summary.pdfCount : 0),
    fillable:
      wocInventory.summary.fillable + (wcReady ? wcInventory.summary.fillable : 0),
    totalFields:
      wocInventory.summary.totalFields + (wcReady ? wcInventory.summary.totalFields : 0),
    woc: wocInventory.summary,
    wc: wcReady ? wcInventory.summary : null,
    fillStrategy: "acroform" as const,
    pack: wcReady
      ? "Divorce WOC + Divorce WC"
      : "Divorce WOC (without children)",
    wcReady,
  };
}
