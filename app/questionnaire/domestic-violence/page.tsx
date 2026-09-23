import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";
import { DomesticViolenceForm, type DomesticViolence } from "./Form";

const SLUG = "domestic-violence";

const EMPTY_DV: DomesticViolence = {
  has_domestic_violence: false,
  order_of_protection_exists: null,
  filed_by: null,
  against_whom: null,
  date_issued: null,
  oop_city: null,
  oop_state: null,
  details: null,
};

export default async function DomesticViolencePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const { caseId } = await getCurrentUserAndCase();
  const { sections, gates, kase } = await loadCaseBundle(caseId);
  const nav = stepLinks(SLUG, gates, kase.last_completed_section, from === "review");

  return (
    <DomesticViolenceForm
      caseId={caseId}
      slug={SLUG}
      backHref={nav.backHref}
      backLabel={nav.backLabel}
      nextHref={nav.nextHref}
      submitLabel={nav.submitLabel}
      initial={{ ...EMPTY_DV, ...(sections.domestic_violence as DomesticViolence | null) }}
    />
  );
}
