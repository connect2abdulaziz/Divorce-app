import { continueCase, openCase, startNewQuestionnaire } from "@/app/dashboard/actions";
import { GenerateDocumentsButton } from "@/components/documents/GenerateDocumentsButton";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { caseDisplayName, listClientCases, type CaseListItem } from "@/lib/cases";
import { getCurrentUser } from "@/lib/questionnaire/current-case";
import { percentComplete, type CaseGates } from "@/lib/questionnaire/steps";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
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

function gatesFromCase(c: CaseListItem): CaseGates {
  return {
    hasCommonChildren: c.has_common_children,
    isSpousePregnant: c.is_spouse_pregnant,
    clientEmploymentStatus: null,
    spouseEmploymentStatus: null,
    hasDomesticViolence: false,
    hasCommunityProperty: c.has_community_property,
    hasRealEstate: c.has_real_estate,
    hasVehicles: c.has_vehicles,
    hasRetirementAccounts: c.has_retirement_accounts,
    hasCommunityDebts: c.has_community_debts,
    hasHouseholdProperty: c.has_household_property,
    hasSeparateProperty: c.has_separate_property,
    hasSeparateDebts: c.has_separate_debts,
  };
}

export default async function ClientDashboardPage() {
  const user = await getCurrentUser();
  const cases = await listClientCases(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink md:text-[2rem]">
            Your questionnaires
          </h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
            Start a new Arizona divorce questionnaire or open one you already began. Each case is
            saved separately.
          </p>
        </div>
        <form action={startNewQuestionnaire}>
          <SubmitButton className="btn-primary whitespace-nowrap" pendingLabel="Starting…">
            Start new questionnaire
          </SubmitButton>
        </form>
      </div>

      {cases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="font-serif text-xl font-semibold text-ink">No questionnaires yet</p>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-muted">
            Start your first questionnaire to collect the information needed for your Arizona divorce
            documents.
          </p>
          <form action={startNewQuestionnaire} className="mt-8">
            <SubmitButton className="btn-primary" pendingLabel="Starting…">
              Start questionnaire
            </SubmitButton>
          </form>
        </div>
      ) : (
        <ul className="space-y-3">
          {cases.map((c) => {
            const status = statusMeta(c.questionnaire_status);
            const inProgress = c.questionnaire_status === "in_progress";
            const percent = inProgress
              ? percentComplete(gatesFromCase(c), c.last_completed_section)
              : null;
            const title = caseDisplayName(c);

            return (
              <li
                key={c.id}
                className="rounded-2xl border border-line/80 bg-white shadow-[0_1px_2px_rgba(33,35,31,0.04),0_12px_28px_rgba(33,35,31,0.05)]"
              >
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="truncate font-serif text-lg font-semibold text-ink">{title}</h2>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      {inProgress ? (
                        <>
                          {percent}% complete · Last saved {formatDate(c.last_saved_at)}
                        </>
                      ) : (
                        <>
                          Submitted {formatDate(c.submitted_at)} · Started {formatDate(c.created_at)}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    <form action={openCase.bind(null, c.id)}>
                      <SubmitButton className="btn-secondary" pendingLabel="Opening…">
                        View
                      </SubmitButton>
                    </form>
                    {inProgress ? (
                      <form action={continueCase.bind(null, c.id)}>
                        <SubmitButton className="btn-primary" pendingLabel="Loading…">
                          Continue
                        </SubmitButton>
                      </form>
                    ) : (
                      <GenerateDocumentsButton
                        caseId={c.id}
                        className="btn-secondary"
                        label="Generate documents"
                      />
                    )}
                  </div>
                </div>
                {inProgress && percent != null ? (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <div className="h-1.5 overflow-hidden rounded-full bg-line/70">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
