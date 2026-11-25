import type { StepInfo } from "@/lib/questionnaire/steps";

export function questionnaireProgressFromSlug(steps: StepInfo[], currentSlug: string) {
  const currentIdx = steps.findIndex((s) => s.slug === currentSlug);
  const percent =
    steps.length === 0
      ? 0
      : currentIdx >= 0
        ? Math.round(((currentIdx + 1) / steps.length) * 100)
        : 0;
  const stepLabel = currentIdx >= 0 ? `Step ${currentIdx + 1} of ${steps.length}` : null;
  const stepLabelCompact = currentIdx >= 0 ? `${currentIdx + 1} / ${steps.length}` : null;
  return { currentIdx, percent, stepLabel, stepLabelCompact };
}