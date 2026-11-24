import { caseDisplayName, type CaseListItem } from "@/lib/cases/shared";
import { percentComplete, type CaseGates } from "@/lib/questionnaire/steps";

export function formatDashboardDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function gatesFromListItem(c: CaseListItem): CaseGates {
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

export type DashboardCaseItem = {
  id: string;
  title: string;
  questionnaireStatus: CaseListItem["questionnaire_status"];
  inProgress: boolean;
  isSubmittedLike: boolean;
  percent: number | null;
  lastSavedAt: string | null;
  lastSavedFormatted: string;
  startedFormatted: string;
  submittedFormatted: string;
};

export function toDashboardCaseItem(c: CaseListItem): DashboardCaseItem {
  const inProgress = c.questionnaire_status === "in_progress";
  const isSubmittedLike =
    c.questionnaire_status === "submitted" || c.questionnaire_status === "completed";
  const percent = inProgress
    ? percentComplete(gatesFromListItem(c), c.last_completed_section)
    : null;

  return {
    id: c.id,
    title: caseDisplayName(c),
    questionnaireStatus: c.questionnaire_status,
    inProgress,
    isSubmittedLike,
    percent,
    lastSavedAt: c.last_saved_at,
    lastSavedFormatted: formatDashboardDate(c.last_saved_at),
    startedFormatted: formatDashboardDate(c.created_at),
    submittedFormatted: formatDashboardDate(c.submitted_at),
  };
}

export function userInitials(email: string) {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (local.slice(0, 2) || "U").toUpperCase();
}