/**
 * Phase 1 merge-field map stubs.
 *
 * Court PDFs are flat (no AcroForm). These logical slots are what Phase 2
 * will stamp onto pages. Keys are stable app-side names; `sources` point at
 * questionnaire columns (table.column).
 */

export type MergeSlot = {
  /** Logical field used by the generator. */
  key: string;
  label: string;
  /** Dot paths into case bundle, e.g. party_client.first_name */
  sources: string[];
  /** Forms that typically need this value (form codes). */
  usedBy?: string[];
};

export const MERGE_SLOTS: MergeSlot[] = [
  {
    key: "client.full_name",
    label: "Petitioner full name",
    sources: ["party_client.first_name", "party_client.middle_name", "party_client.last_name"],
    usedBy: ["DRDA10F", "DRDCF", "DRDA81F", "DRDC81F", "DRA71F", "DRA710F"],
  },
  {
    key: "client.first_name",
    label: "Petitioner first name",
    sources: ["party_client.first_name"],
  },
  {
    key: "client.middle_name",
    label: "Petitioner middle name",
    sources: ["party_client.middle_name"],
  },
  {
    key: "client.last_name",
    label: "Petitioner last name",
    sources: ["party_client.last_name"],
  },
  {
    key: "client.dob",
    label: "Petitioner date of birth",
    sources: ["party_client.date_of_birth"],
  },
  {
    key: "client.ssn_last4",
    label: "Petitioner SSN last 4",
    sources: ["party_client.ssn_last4"],
    usedBy: ["DRSDS10FA", "DRSDS10FC"],
  },
  {
    key: "client.address",
    label: "Petitioner street address",
    sources: ["party_client.address_line1", "party_client.address_line2"],
  },
  {
    key: "client.city",
    label: "Petitioner city",
    sources: ["party_client.city"],
  },
  {
    key: "client.state",
    label: "Petitioner state",
    sources: ["party_client.state"],
  },
  {
    key: "client.zip",
    label: "Petitioner ZIP",
    sources: ["party_client.zip"],
  },
  {
    key: "client.phone",
    label: "Petitioner phone",
    sources: ["party_client.cell_phone", "party_client.home_phone", "party_client.phone"],
  },
  {
    key: "client.email",
    label: "Petitioner email",
    sources: ["party_client.email"],
  },
  {
    key: "spouse.full_name",
    label: "Respondent full name",
    sources: ["party_spouse.first_name", "party_spouse.middle_name", "party_spouse.last_name"],
  },
  {
    key: "spouse.dob",
    label: "Respondent date of birth",
    sources: ["party_spouse.date_of_birth"],
  },
  {
    key: "spouse.ssn_last4",
    label: "Respondent SSN last 4",
    sources: ["party_spouse.ssn_last4"],
  },
  {
    key: "spouse.address",
    label: "Respondent address",
    sources: ["party_spouse.address_line1", "party_spouse.city", "party_spouse.state", "party_spouse.zip"],
  },
  {
    key: "marriage.date",
    label: "Date of marriage",
    sources: ["marriage.marriage_date"],
  },
  {
    key: "marriage.city",
    label: "Place of marriage — city",
    sources: ["marriage.marriage_city"],
  },
  {
    key: "marriage.state",
    label: "Place of marriage — state",
    sources: ["marriage.marriage_state"],
  },
  {
    key: "marriage.separation_date",
    label: "Date of separation",
    sources: ["marriage.separation_date"],
  },
  {
    key: "marriage.restore_name",
    label: "Restore former name",
    sources: ["marriage.restore_former_name", "marriage.restored_first_name", "marriage.restored_last_name"],
  },
  {
    key: "employment.client_employer",
    label: "Petitioner employer",
    sources: ["employment.client_employer_name", "employment.client_monthly_income"],
  },
  {
    key: "employment.spouse_employer",
    label: "Respondent employer",
    sources: ["employment.spouse_employer_name", "employment.spouse_monthly_income"],
  },
  {
    key: "parenting.custody",
    label: "Custody arrangement",
    sources: ["parenting.custody_arrangement", "parenting.decision_making"],
    usedBy: ["DRCVG11F", "DREO81FZ", "DREO82FZ"],
  },
  {
    key: "parenting.schedule",
    label: "Parenting time schedule",
    sources: ["parenting.parenting_time_schedule", "parenting.visitation_wanted"],
  },
  {
    key: "tax.dependents",
    label: "Who claims dependents",
    sources: ["tax_information.dependents_claimed_by", "tax_information.claim_frequency"],
  },
  {
    key: "children.list",
    label: "Minor children (repeatable)",
    sources: ["children.first_name", "children.last_name", "children.date_of_birth", "children.ssn_last4"],
    usedBy: ["DRCVG13F", "DRDCF", "DRDC81F"],
  },
  {
    key: "assets.real_estate",
    label: "Real estate list",
    sources: ["real_estate.address", "real_estate.estimated_value", "real_estate.assigned_to"],
  },
  {
    key: "assets.vehicles",
    label: "Vehicles list",
    sources: ["vehicles.year", "vehicles.make", "vehicles.model", "vehicles.assigned_to"],
  },
  {
    key: "debts.community",
    label: "Community debts",
    sources: ["community_debts.creditor", "community_debts.amount_owed", "community_debts.amount_client_pays"],
  },
];

export function mergeSlotsForForm(formCode: string): MergeSlot[] {
  const code = formCode.toUpperCase();
  return MERGE_SLOTS.filter((s) => s.usedBy?.some((u) => u.toUpperCase() === code) ?? false);
}
