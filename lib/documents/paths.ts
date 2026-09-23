import path from "path";
import { existsSync } from "fs";

/** Without-children AcroForm pack. */
export const WOC_TEMPLATE_ROOT = path.join(process.cwd(), "Divorce WOC");

/** With-children AcroForm pack. */
export const WC_TEMPLATE_ROOT = path.join(process.cwd(), "Divorce WC");

export function templateRootForTrack(track: "with_children" | "without_children"): string {
  if (track === "with_children") {
    if (!existsSync(WC_TEMPLATE_ROOT)) {
      throw new Error(
        'Divorce WC folder not found. Add fillable AcroForm PDFs under "Divorce WC" in the project root.'
      );
    }
    return WC_TEMPLATE_ROOT;
  }
  if (!existsSync(WOC_TEMPLATE_ROOT)) {
    throw new Error('Divorce WOC folder not found at project root.');
  }
  return WOC_TEMPLATE_ROOT;
}

export function isWcPackAvailable(): boolean {
  return existsSync(WC_TEMPLATE_ROOT);
}
