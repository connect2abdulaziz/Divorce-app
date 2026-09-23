import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";
import { MarriageForm, type Marriage } from "./Form";

const SLUG = "marriage";

const EMPTY_MARRIAGE: Marriage = {
  marriage_date: null,
  separation_date: null,
  marriage_location: null,
  marriage_city: null,
  marriage_state: null,
  grounds: null,
  due_date: null,
  restore_former_name: null,
  restored_first_name: null,
  restored_middle_name: null,
  restored_last_name: null,
  spouse_is_father: null,
};

export default async function MarriagePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const { caseId } = await getCurrentUserAndCase();
  const { sections, gates, kase } = await loadCaseBundle(caseId);
  const nav = stepLinks(SLUG, gates, kase.last_completed_section, from === "review");

  return (
    <MarriageForm
      caseId={caseId}
      slug={SLUG}
      backHref={nav.backHref}
      backLabel={nav.backLabel}
      nextHref={nav.nextHref}
      submitLabel={nav.submitLabel}
      initial={{ ...EMPTY_MARRIAGE, ...(sections.marriage as Marriage | null) }}
      initialPregnant={gates.isSpousePregnant}
    />
  );
}
