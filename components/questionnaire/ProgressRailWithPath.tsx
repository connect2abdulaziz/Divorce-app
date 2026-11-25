"use client";

import type { StepInfo } from "@/lib/questionnaire/steps";
import { ProgressRail } from "./ProgressRail";
import { useQuestionnaireProgress } from "./useQuestionnaireProgress";

/** @deprecated Desktop header rail — use sidebar + mobile strip instead. Kept for legacy variant callers. */
export function ProgressRailWithPath({
  steps,
  lastCompletedSlug,
}: {
  steps: StepInfo[];
  lastCompletedSlug: string | null;
  /** Ignored — percent is derived from the current path so it stays in sync with Step X of Y. */
  percent?: number;
}) {
  const { currentSlug, percent } = useQuestionnaireProgress(steps);

  return (
    <ProgressRail
      steps={steps}
      currentSlug={currentSlug}
      lastCompletedSlug={lastCompletedSlug}
      percent={percent}
    />
  );
}
