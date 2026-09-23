import { redirect } from "next/navigation";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";
import { ParentingForm, type Parenting } from "./Form";

const SLUG = "parenting";

const EMPTY_PARENTING: Parenting = {
  custody_arrangement: null,
  decision_making: null,
  parenting_time_schedule: null,
  visitation_wanted: null,
  visitation_denied_reason: null,
  notes: null,
};

export default async function ParentingPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const { caseId } = await getCurrentUserAndCase();
  const { sections, gates, kase } = await loadCaseBundle(caseId);

  // This whole section disappears from the rail when there are no common
  // children — guard direct URL access the same way.
  if (gates.hasCommonChildren !== true) {
    redirect(from === "review" ? "/questionnaire/children?from=review" : "/questionnaire/children");
  }

  const nav = stepLinks(SLUG, gates, kase.last_completed_section, from === "review");

  return (
    <ParentingForm
      caseId={caseId}
      slug={SLUG}
      backHref={nav.backHref}
      backLabel={nav.backLabel}
      nextHref={nav.nextHref}
      submitLabel={nav.submitLabel}
      initial={{ ...EMPTY_PARENTING, ...(sections.parenting as Parenting | null) }}
    />
  );
}
