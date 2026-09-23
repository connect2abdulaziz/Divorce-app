import Link from "next/link";
import { continueCase } from "@/app/dashboard/actions";
import { CaseSummary } from "@/components/questionnaire/CaseSummary";
import { FormPanel } from "@/components/questionnaire/FormPanel";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { caseDisplayName, getOwnedCase, listClientCases } from "@/lib/cases";
import { getCurrentUser } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { percentComplete } from "@/lib/questionnaire/steps";
import { notFound } from "next/navigation";
import { GenerateDocumentsButton } from "@/components/documents/GenerateDocumentsButton";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatSavedAt(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusMeta(status: string) {
  if (status === "submitted") {
    return { label: "Submitted", className: "bg-accent-soft text-accent-dark" };
  }
  if (status === "completed") {
    return { label: "Completed", className: "bg-navy/10 text-navy" };
  }
  return { label: "In progress", className: "bg-caution/10 text-caution" };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }> | { caseId: string };
}) {
  const { caseId } = await Promise.resolve(params);
  const user = await getCurrentUser();
  const owned = await getOwnedCase(user.id, caseId);
  if (!owned) notFound();

  const { kase, gates } = await loadCaseBundle(owned.id);
  const cases = await listClientCases(user.id);
  const listItem = cases.find((c) => c.id === owned.id);
  const title = listItem ? caseDisplayName(listItem) : "Arizona divorce questionnaire";
  const inProgress = kase.questionnaire_status === "in_progress";
  const percent = percentComplete(gates, kase.last_completed_section);
  const status = statusMeta(kase.questionnaire_status);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          ← All questionnaires
        </Link>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">{title}</h1>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            <p className="mt-2 text-[15px] text-muted">
              {inProgress
                ? `${percent}% complete · Last saved ${formatSavedAt(kase.last_saved_at)}`
                : `Submitted ${formatDate(kase.submitted_at)}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            {inProgress ? (
              <form action={continueCase.bind(null, owned.id)}>
                <SubmitButton className="btn-primary" pendingLabel="Loading…">
                  Continue questionnaire
                </SubmitButton>
              </form>
            ) : null}
            <GenerateDocumentsButton
              caseId={owned.id}
              className="btn-secondary"
              label="Generate documents"
            />
          </div>
        </div>
        {!inProgress ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            This questionnaire is locked after submission. Contact us if something needs to change.
            You can download a filled filing packet below.
          </p>
        ) : null}
      </div>

      <FormPanel>
        <div className="border-b border-line/70 px-6 py-5 md:px-8">
          <h2 className="font-serif text-xl font-semibold text-ink">Answers</h2>
          <p className="mt-1 text-sm text-muted">
            {inProgress
              ? "Edit from Review or by continuing the questionnaire."
              : "Read-only summary of what you submitted."}
          </p>
        </div>
        <div className="px-6 md:px-8">
          <CaseSummary
            caseId={owned.id}
            editHrefFor={
              inProgress ? (slug) => `/questionnaire/${slug}?from=review` : undefined
            }
          />
        </div>
      </FormPanel>
    </div>
  );
}
