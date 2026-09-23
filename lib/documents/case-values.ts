import type { loadCaseBundle } from "@/lib/questionnaire/data";

export type CaseBundle = Awaited<ReturnType<typeof loadCaseBundle>>;

function s(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

function join(...parts: unknown[]) {
  return parts.map(s).filter(Boolean).join(" ").trim();
}

function cityStateZip(city: unknown, state: unknown, zip: unknown) {
  const left = [s(city), s(state)].filter(Boolean).join(", ");
  return [left, s(zip)].filter(Boolean).join(" ").trim();
}

function azResidency(years: unknown, months: unknown) {
  const y = years == null || years === "" ? null : Number(years);
  const m = months == null || months === "" ? null : Number(months);
  if (y == null && m == null) return "";
  const bits: string[] = [];
  if (y != null && Number.isFinite(y)) bits.push(`${y} year${y === 1 ? "" : "s"}`);
  if (m != null && Number.isFinite(m)) bits.push(`${m} month${m === 1 ? "" : "s"}`);
  return bits.join(", ");
}

function money(v: unknown) {
  if (v == null || v === "") return "";
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : s(v);
}

function ageFromDob(dob: string): string {
  if (!dob) return "";
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age >= 0 ? String(age) : "";
}

function bornBefore(dob: string, marriageDate: string): boolean {
  if (!dob || !marriageDate) return false;
  const child = new Date(dob);
  const married = new Date(marriageDate);
  if (Number.isNaN(child.getTime()) || Number.isNaN(married.getTime())) return false;
  return child.getTime() < married.getTime();
}

function childPrimaryResidence(child: Record<string, unknown>) {
  const residences = (child.child_residences as Array<Record<string, unknown>> | undefined) ?? [];
  const primary =
    residences.find((r) => r.is_primary_residence === true) ?? residences[0] ?? null;
  if (!primary) return { address: "", csz: "", length: "", livedWith: "" };
  const address = s(primary.street_address) || s(primary.address);
  const csz = cityStateZip(primary.city, primary.state, primary.zip);
  const start = s(primary.start_date);
  const end = s(primary.end_date) || "present";
  const length = start ? `${start} – ${end}` : "";
  return { address, csz, length, livedWith: s(primary.lived_with) };
}

/** Normalized values used to fill Arizona AcroForm captions + petition. */
export function buildCaseFillValues(bundle: CaseBundle) {
  const c = (bundle.sections.party_client ?? {}) as Record<string, unknown>;
  const sp = (bundle.sections.party_spouse ?? {}) as Record<string, unknown>;
  const m = (bundle.sections.marriage ?? {}) as Record<string, unknown>;
  const e = (bundle.sections.employment ?? {}) as Record<string, unknown>;
  const dv = (bundle.sections.domestic_violence ?? {}) as Record<string, unknown>;
  const tax = (bundle.sections.tax_information ?? {}) as Record<string, unknown>;
  const parenting = (bundle.sections.parenting ?? {}) as Record<string, unknown>;

  const clientName = join(c.first_name, c.middle_name, c.last_name);
  const spouseName = join(sp.first_name, sp.middle_name, sp.last_name);
  const clientPhone = s(c.cell_phone) || s(c.home_phone) || s(c.phone);
  const clientAddress = join(c.address_line1, c.address_line2);
  const clientCsz = cityStateZip(c.city, c.state, c.zip);
  const spouseAddress = sp.address_unknown
    ? ""
    : join(sp.address_line1, sp.address_line2);
  const spouseCsz = sp.address_unknown ? "" : cityStateZip(sp.city, sp.state, sp.zip);

  const marriageDate = s(m.marriage_date);
  const marriagePlace = join(m.marriage_city, m.marriage_state) || s(m.marriage_location);

  const rawChildren = (bundle.records.children ?? []) as Array<Record<string, unknown>>;
  const children = rawChildren.map((ch) => {
    const fullName = join(ch.first_name, ch.middle_name, ch.last_name);
    const dob = s(ch.date_of_birth);
    const res = childPrimaryResidence(ch);
    return {
      fullName,
      first: s(ch.first_name),
      middle: s(ch.middle_name),
      last: s(ch.last_name),
      dob,
      age: ageFromDob(dob),
      ssnLast4: s(ch.ssn_last4),
      primaryAddress: res.address,
      primaryCsz: res.csz,
      lengthAtAddress: res.length,
      livedWith: res.livedWith,
      bornPriorToMarriage: bornBefore(dob, marriageDate),
    };
  });

  const decisionMaking = s(parenting.decision_making).toLowerCase();
  const isJointDecision =
    decisionMaking.includes("joint") || s(parenting.custody_arrangement).toLowerCase().includes("joint");
  const isSoleDecision =
    decisionMaking.includes("sole") || s(parenting.custody_arrangement).toLowerCase().includes("sole");

  return {
    clientName,
    spouseName,
    clientFirst: s(c.first_name),
    clientMiddle: s(c.middle_name),
    clientLast: s(c.last_name),
    spouseFirst: s(sp.first_name),
    spouseMiddle: s(sp.middle_name),
    spouseLast: s(sp.last_name),
    clientDob: s(c.date_of_birth),
    spouseDob: s(sp.date_of_birth),
    clientAddress,
    clientCsz,
    clientPhone,
    clientEmail: s(c.email),
    clientHeight: s(c.height),
    clientWeight: c.weight_lbs != null ? String(c.weight_lbs) : "",
    clientSsnLast4: s(c.ssn_last4),
    clientAzYears: c.az_years != null ? String(c.az_years) : "",
    clientAzMonths: c.az_months != null ? String(c.az_months) : "",
    clientAzResidency: azResidency(c.az_years, c.az_months),
    spouseAddress,
    spouseCsz,
    spousePhone: sp.phone_unknown ? "" : s(sp.cell_phone) || s(sp.home_phone) || s(sp.phone),
    spouseEmail: s(sp.email),
    spouseSsnLast4: sp.ssn_unknown ? "" : s(sp.ssn_last4),
    spouseAzYears: sp.az_years != null ? String(sp.az_years) : "",
    spouseAzMonths: sp.az_months != null ? String(sp.az_months) : "",
    spouseAzResidency: azResidency(sp.az_years, sp.az_months),
    marriageDate,
    separationDate: s(m.separation_date),
    marriagePlace,
    restoreName: Boolean(m.restore_former_name),
    restoredFirst: s(m.restored_first_name),
    restoredMiddle: s(m.restored_middle_name),
    restoredLast: s(m.restored_last_name),
    pregnant: bundle.gates.isSpousePregnant === true,
    dueDate: s(m.due_date),
    spouseIsFather: m.spouse_is_father === true,
    clientEmployed: e.client_status === "employed",
    clientJobTitle: s(e.client_position),
    clientEmployer: s(e.client_employer_name),
    clientEmployerAddress: join(
      e.client_employer_address,
      cityStateZip(e.client_employer_city, e.client_employer_state, e.client_employer_zip)
    ),
    clientIncome: money(e.client_monthly_income),
    spouseEmployed: e.spouse_status === "employed",
    spouseJobTitle: s(e.spouse_position),
    spouseEmployer: s(e.spouse_employer_name),
    spouseEmployerAddress: join(
      e.spouse_employer_address,
      cityStateZip(e.spouse_employer_city, e.spouse_employer_state, e.spouse_employer_zip)
    ),
    spouseIncome: money(e.spouse_monthly_income),
    hasDv: Boolean(dv.has_domestic_violence),
    hasCommunityProperty: bundle.gates.hasCommunityProperty === true,
    hasRealEstate: bundle.gates.hasRealEstate === true,
    hasVehicles: bundle.gates.hasVehicles === true,
    hasRetirement: bundle.gates.hasRetirementAccounts === true,
    hasHousehold: bundle.gates.hasHouseholdProperty === true,
    hasCommunityDebts: bundle.gates.hasCommunityDebts === true,
    hasSeparateProperty: bundle.gates.hasSeparateProperty === true,
    hasSeparateDebts: bundle.gates.hasSeparateDebts === true,
    taxClaimedBy: s(tax.dependents_claimed_by),
    taxFrequency: s(tax.claim_frequency),
    children,
    hasCommonChildren: bundle.gates.hasCommonChildren === true,
    parenting: {
      custodyArrangement: s(parenting.custody_arrangement),
      decisionMaking: s(parenting.decision_making),
      parentingTimeSchedule: s(parenting.parenting_time_schedule),
      notes: s(parenting.notes),
      visitationWanted: parenting.visitation_wanted === true,
      visitationDeniedReason: s(parenting.visitation_denied_reason),
      isJointDecision,
      isSoleDecision,
    },
    realEstate: bundle.records.real_estate as Array<Record<string, unknown>>,
    vehicles: bundle.records.vehicles as Array<Record<string, unknown>>,
    retirement: bundle.records.retirement_accounts as Array<Record<string, unknown>>,
    household: bundle.records.personal_property as Array<Record<string, unknown>>,
    communityDebts: bundle.records.community_debts as Array<Record<string, unknown>>,
    separateProperty: bundle.records.separate_property as Array<Record<string, unknown>>,
    separateDebts: bundle.records.separate_debts as Array<Record<string, unknown>>,
  };
}

export type CaseFillValues = ReturnType<typeof buildCaseFillValues>;

/** Shared caption block present on most AZ family-court forms. */
export function commonCaptionFields(v: CaseFillValues): Record<string, string | boolean> {
  return {
    "Person Filing": v.clientName,
    "Address if not protected": v.clientAddress,
    "City State Zip Code": v.clientCsz,
    Telephone: v.clientPhone,
    "Email Address": v.clientEmail,
    Email: v.clientEmail,
    "Self without a Lawyer": true,
    "Self without a Lawyer OR": true,
    "Self without a Lawyer  OR": true,
    Representing: true,
    Petitioner: true,
    "Petitioner OR": true,
    "Name of PetitionerParty A": v.clientName,
    "Nameof Petitioner  Party A": v.clientName,
    "Name of Petitioner  Party A": v.clientName,
    "Name of Petitioner": v.clientName,
    "Petitioner  Party A": v.clientName,
    "PetitionerParty A": v.clientName,
    "Name of RespondentParty B": v.spouseName,
    "Name of Respondent  Party B": v.spouseName,
    "Name of Respondent": v.spouseName,
    "Respondent  Party B": v.spouseName,
    "RespondentParty B": v.spouseName,
    "Name of opposing party DR11f": v.spouseName,
  };
}
