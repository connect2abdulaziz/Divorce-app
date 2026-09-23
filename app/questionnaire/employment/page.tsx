import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";
import { EmploymentForm, type Employment } from "./Form";

const SLUG = "employment";

const EMPTY_EMPLOYMENT: Employment = {
  client_status: null,
  client_employer_name: null,
  client_position: null,
  client_employer_phone: null,
  client_employer_address: null,
  client_employer_city: null,
  client_employer_state: null,
  client_employer_zip: null,
  client_monthly_income: null,
  client_annual_income: null,
  spouse_status: null,
  spouse_employer_name: null,
  spouse_position: null,
  spouse_employer_phone: null,
  spouse_employer_address: null,
  spouse_employer_city: null,
  spouse_employer_state: null,
  spouse_employer_zip: null,
  spouse_monthly_income: null,
  spouse_annual_income: null,
};

export default async function EmploymentPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const { caseId } = await getCurrentUserAndCase();
  const { sections, gates, kase } = await loadCaseBundle(caseId);
  const nav = stepLinks(SLUG, gates, kase.last_completed_section, from === "review");

  return (
    <EmploymentForm
      caseId={caseId}
      slug={SLUG}
      backHref={nav.backHref}
      backLabel={nav.backLabel}
      nextHref={nav.nextHref}
      submitLabel={nav.submitLabel}
      initial={{ ...EMPTY_EMPLOYMENT, ...(sections.employment as Employment | null) }}
    />
  );
}
