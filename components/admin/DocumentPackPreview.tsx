import { loadCaseBundle } from "@/lib/questionnaire/data";
import {
  getFieldInventorySummary,
  isWcPackAvailable,
  selectDocumentPack,
  type DecreePath,
} from "@/lib/documents";

const PATH_LABELS: Record<DecreePath, string> = {
  default_decree: "4a — Default decree",
  consent_decree: "4b — Consent decree",
  summary_consent: "Summary consent",
};

export async function DocumentPackPreview({
  caseId,
  decreePath = "default_decree",
}: {
  caseId: string;
  decreePath?: DecreePath;
}) {
  const { gates } = await loadCaseBundle(caseId);
  const pack = selectDocumentPack({
    hasCommonChildren: gates.hasCommonChildren,
    decreePath,
    includeOptional: false,
    steps: ["filing", "service", "default", "decree"],
  });
  const inventory = getFieldInventorySummary();
  const wcReady = isWcPackAvailable();

  const byStep = pack.templates.reduce(
    (acc, tpl) => {
      (acc[tpl.step] ??= []).push(tpl);
      return acc;
    },
    {} as Record<string, typeof pack.templates>
  );

  return (
    <section className="rounded-2xl border border-line/80 bg-white p-5 print:hidden">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg font-semibold text-ink">Document pack</h2>
          <p className="mt-1 text-sm text-muted">
            Using{" "}
            <span className="text-ink">
              {pack.track === "with_children" ? "Divorce WC" : "Divorce WOC"}
            </span>{" "}
            AcroForms (
            {pack.track === "with_children" && inventory.wc
              ? `${inventory.wc.totalFields} fields across ${inventory.wc.pdfCount} templates`
              : `${inventory.woc.totalFields} fields across ${inventory.woc.pdfCount} templates`}
            ). Generate fills the filing packet by default.
          </p>
          {gates.hasCommonChildren === true && !wcReady ? (
            <p className="mt-2 text-sm text-caution">
              This case has children. Add the <code className="text-ink">Divorce WC</code> AcroForm
              folder to enable with-children generation.
            </p>
          ) : null}
        </div>
        <div className="text-right text-sm text-muted">
          <p>
            Track:{" "}
            <span className="text-ink">
              {pack.track === "with_children" ? "With children" : "Without children"}
            </span>
          </p>
          <p>
            Path: <span className="text-ink">{PATH_LABELS[pack.decreePath]}</span>
          </p>
          <p>
            Catalog forms: <span className="text-ink">{pack.templates.length}</span>
          </p>
        </div>
      </div>

      {pack.templates.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No templates available for this track yet.</p>
      ) : (
        <div className="mt-4 space-y-4 text-sm">
          {(["filing", "service", "default", "decree"] as const).map((step) => {
            const list = byStep[step];
            if (!list?.length) return null;
            return (
              <div key={step}>
                <p className="text-xs font-medium uppercase tracking-wide text-accent">{step}</p>
                <ul className="mt-1.5 space-y-1 text-ink">
                  {list.map((tpl) => (
                    <li key={tpl.id} className="flex gap-2">
                      <span className="w-28 shrink-0 text-muted">{tpl.formCode ?? "—"}</span>
                      <span>
                        {tpl.title}
                        {tpl.optional ? <span className="text-muted"> (optional)</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
