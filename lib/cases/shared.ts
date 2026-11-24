export const ACTIVE_CASE_COOKIE = "ldd_active_case";

export type CaseRow = {
  id: string;
  client_id: string;
  questionnaire_status: "in_progress" | "submitted" | "completed";
  last_completed_section: string | null;
  submitted_at: string | null;
  completed_at: string | null;
  last_saved_at: string;
  created_at: string;
  updated_at: string;
  has_common_children: boolean | null;
  is_spouse_pregnant: boolean | null;
  has_community_property: boolean | null;
  has_real_estate: boolean | null;
  has_vehicles: boolean | null;
  has_retirement_accounts: boolean | null;
  has_community_debts: boolean | null;
  has_household_property: boolean | null;
  has_separate_property: boolean | null;
  has_separate_debts: boolean | null;
};

export type CaseListItem = CaseRow & {
  party_client:
    | { first_name: string | null; last_name: string | null }
    | { first_name: string | null; last_name: string | null }[]
    | null;
};

function firstRel<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function caseDisplayName(item: CaseListItem) {
  const party = firstRel(item.party_client);
  const name = [party?.first_name, party?.last_name].filter(Boolean).join(" ");
  return name || "Arizona divorce questionnaire";
}