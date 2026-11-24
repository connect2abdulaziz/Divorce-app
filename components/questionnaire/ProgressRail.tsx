import type { StepInfo } from "@/lib/questionnaire/steps";

export function ProgressRail({
  steps,
  currentSlug,
  percent,
  variant = "portal",
}: {
  steps: StepInfo[];
  currentSlug: string;
  lastCompletedSlug?: string | null;
  percent: number;
  variant?: "portal" | "legacy";
}) {
  const currentIdx = steps.findIndex((s) => s.slug === currentSlug);
  const current = currentIdx >= 0 ? steps[currentIdx] : null;
  const stepLabel = currentIdx >= 0 ? `Step ${currentIdx + 1} of ${steps.length}` : null;
  const width = `${Math.min(100, Math.max(0, percent))}%`;

  if (variant === "legacy") {
    return (
      <div className="border-t border-line/70">
        <div className="mx-auto flex max-w-3xl items-end justify-between gap-4 px-5 pb-3 pt-3 md:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{current?.title ?? "Questionnaire"}</p>
            {stepLabel && <p className="mt-0.5 text-xs text-muted">{stepLabel}</p>}
          </div>
          <p className="shrink-0 text-sm tabular-nums text-muted">{percent}%</p>
        </div>
        <div className="h-1.5 w-full bg-line/60">
          <div className="h-1.5 bg-accent transition-[width] duration-500 ease-out" style={{ width }} />
        </div>
      </div>
    );
  }

  return (
    <div className="ldd-q-progress">
      <div className="ldd-q-progress__inner">
        <div className="min-w-0">
          <p className="ldd-q-progress__title">{current?.title ?? "Questionnaire"}</p>
          {stepLabel ? <p className="ldd-q-progress__meta">{stepLabel}</p> : null}
        </div>
        <p className="ldd-q-progress__percent" aria-label="Completion progress">
          {percent}%
        </p>
      </div>
      <div
        className="ldd-q-progress__track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Questionnaire progress"
      >
        <div className="ldd-q-progress__fill" style={{ width }} />
      </div>
    </div>
  );
}
