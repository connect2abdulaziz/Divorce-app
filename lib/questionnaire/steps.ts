// The single source of truth for the questionnaire's sections, their order,
// and when each one is visible. Used to render the progress rail, compute
// percent-complete, guard direct URL access, and drive Back/Continue links.

export type CaseGates = {
  hasCommonChildren: boolean | null;
  isSpousePregnant: boolean | null;
  clientEmploymentStatus: string | null;
  spouseEmploymentStatus: string | null;
  hasDomesticViolence: boolean;
  hasRealEstate: boolean | null;
  hasVehicles: boolean | null;
  hasRetirementAccounts: boolean | null;
  hasCommunityDebts: boolean | null;
  hasHouseholdProperty: boolean | null;
  hasSeparateProperty: boolean | null;
  hasSeparateDebts: boolean | null;
};

export type StepInfo = {
  slug: string;
  title: string;
  shortTitle: string; // used in the narrow progress rail
};

export type Step = StepInfo & {
  isVisible: (gates: CaseGates) => boolean;
};

export function toStepInfo(step: Step): StepInfo {
  return { slug: step.slug, title: step.title, shortTitle: step.shortTitle };
}

export const STEPS: Step[] = [
  { slug: "client-info", title: "Your Information", shortTitle: "Your info", isVisible: () => true },
  { slug: "spouse-info", title: "Spouse Information", shortTitle: "Spouse", isVisible: () => true },
  { slug: "marriage", title: "Marriage & Separation", shortTitle: "Marriage", isVisible: () => true },
  { slug: "employment", title: "Employment & Income", shortTitle: "Employment", isVisible: () => true },
  { slug: "domestic-violence", title: "Domestic Violence", shortTitle: "Safety", isVisible: () => true },
  { slug: "children", title: "Children", shortTitle: "Children", isVisible: () => true },
  {
    slug: "parenting",
    title: "Custody & Parenting",
    shortTitle: "Parenting",
    isVisible: (g) => g.hasCommonChildren === true,
  },
  { slug: "tax-information", title: "Tax Information", shortTitle: "Taxes", isVisible: () => true },
  { slug: "real-estate", title: "Real Estate", shortTitle: "Real estate", isVisible: () => true },
  { slug: "vehicles", title: "Vehicles", shortTitle: "Vehicles", isVisible: () => true },
  { slug: "retirement", title: "Retirement Accounts", shortTitle: "Retirement", isVisible: () => true },
  { slug: "community-debts", title: "Community Debts", shortTitle: "Debts", isVisible: () => true },
  { slug: "household-property", title: "Household Property", shortTitle: "Household", isVisible: () => true },
  { slug: "separate-property", title: "Separate Property", shortTitle: "Separate prop.", isVisible: () => true },
  { slug: "separate-debts", title: "Separate Debt", shortTitle: "Separate debt", isVisible: () => true },
  { slug: "review", title: "Review", shortTitle: "Review", isVisible: () => true },
  { slug: "submit", title: "Submit", shortTitle: "Submit", isVisible: () => true },
];

// Sections whose gate question decides whether the WHOLE section disappears
// from the rail (as opposed to just hiding a sub-part of the same page).
// Only "parenting" works this way today — it depends on an answer given on
// the earlier "children" page.
export function visibleSteps(gates: CaseGates): Step[] {
  return STEPS.filter((s) => s.isVisible(gates));
}

export function stepIndex(slug: string, gates: CaseGates): number {
  return visibleSteps(gates).findIndex((s) => s.slug === slug);
}

export function nextStepSlug(slug: string, gates: CaseGates): string | null {
  const steps = visibleSteps(gates);
  const idx = steps.findIndex((s) => s.slug === slug);
  if (idx === -1 || idx === steps.length - 1) return null;
  return steps[idx + 1].slug;
}

export function prevStepSlug(slug: string, gates: CaseGates): string | null {
  const steps = visibleSteps(gates);
  const idx = steps.findIndex((s) => s.slug === slug);
  if (idx <= 0) return null;
  return steps[idx - 1].slug;
}

export function isLaterStep(candidate: string, current: string | null): boolean {
  if (!current) return true;
  const nextIdx = STEPS.findIndex((s) => s.slug === candidate);
  const currentIdx = STEPS.findIndex((s) => s.slug === current);
  if (nextIdx === -1) return false;
  if (currentIdx === -1) return true;
  return nextIdx > currentIdx;
}

// True once the client has finished the last content step and reached Review
// (or Submit). Editing an earlier section should return here, not replay the
// rest of the questionnaire.
export function hasReachedReview(lastCompletedSlug: string | null, gates: CaseGates): boolean {
  if (!lastCompletedSlug) return false;
  if (lastCompletedSlug === "review" || lastCompletedSlug === "submit") return true;
  const steps = visibleSteps(gates);
  const lastIdx = steps.findIndex((s) => s.slug === lastCompletedSlug);
  const reviewIdx = steps.findIndex((s) => s.slug === "review");
  if (lastIdx === -1 || reviewIdx === -1) return false;
  return lastIdx >= reviewIdx - 1;
}

export type StepLinks = {
  backHref: string | null;
  nextHref: string;
  submitLabel: string;
  backLabel: string;
};

export function stepLinks(
  slug: string,
  gates: CaseGates,
  lastCompletedSlug: string | null,
  fromReview = false
): StepLinks {
  if (fromReview || hasReachedReview(lastCompletedSlug, gates)) {
    return {
      backHref: "/questionnaire/review",
      nextHref: "/questionnaire/review",
      submitLabel: "Save & return to review",
      backLabel: "Back to review",
    };
  }

  const back = prevStepSlug(slug, gates);
  const next = nextStepSlug(slug, gates) ?? "review";
  return {
    backHref: back ? `/questionnaire/${back}` : null,
    nextHref: `/questionnaire/${next}`,
    submitLabel: "Save & continue",
    backLabel: "Back",
  };
}

// Progress excludes the Review and Submit steps themselves from the
// denominator's "content" framing but still counts as reachable — simplest
// correct behavior: percent = (steps before/at last_completed_section) /
// (total visible steps), computed by the caller once it has last_completed_section.
export function percentComplete(gates: CaseGates, lastCompletedSlug: string | null): number {
  const steps = visibleSteps(gates);
  if (!lastCompletedSlug) return 0;
  const idx = steps.findIndex((s) => s.slug === lastCompletedSlug);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / steps.length) * 100);
}
