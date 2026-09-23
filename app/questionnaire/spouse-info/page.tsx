import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";
import { SpouseInfoForm, type PartySpouse } from "./Form";

const SLUG = "spouse-info";

const EMPTY_SPOUSE: PartySpouse = {
  first_name: null,
  middle_name: null,
  last_name: null,
  date_of_birth: null,
  height: null,
  weight_lbs: null,
  az_years: null,
  az_months: null,
  address_line1: null,
  address_line2: null,
  city: null,
  state: null,
  zip: null,
  home_phone: null,
  cell_phone: null,
  phone: null,
  email: null,
  ssn_last4: null,
  address_unknown: false,
  phone_unknown: false,
  ssn_unknown: false,
};

export default async function SpouseInfoPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const { caseId } = await getCurrentUserAndCase();
  const { sections, gates, kase } = await loadCaseBundle(caseId);
  const nav = stepLinks(SLUG, gates, kase.last_completed_section, from === "review");

  return (
    <SpouseInfoForm
      caseId={caseId}
      slug={SLUG}
      backHref={nav.backHref}
      backLabel={nav.backLabel}
      nextHref={nav.nextHref}
      submitLabel={nav.submitLabel}
      initial={{ ...EMPTY_SPOUSE, ...(sections.party_spouse as PartySpouse | null) }}
    />
  );
}
