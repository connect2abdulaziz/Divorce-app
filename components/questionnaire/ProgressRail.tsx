import type { StepInfo } from "@/lib/questionnaire/steps";

export function ProgressRail({
  steps,
  currentSlug,
  percent,
}: {
  steps: StepInfo[];
  currentSlug: string;
  lastCompletedSlug?: string | null;
  percent: number;
}) {
  const currentIdx = steps.findIndex((s) => s.slug === currentSlug);
  const current = currentIdx >= 0 ? steps[currentIdx] : null;
  const stepLabel = currentIdx >= 0 ? `Step ${currentIdx + 1} of ${steps.length}` : null;

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
        <div
          className="h-1.5 bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
}
