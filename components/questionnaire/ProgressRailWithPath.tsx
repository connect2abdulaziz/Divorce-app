"use client";

import { usePathname } from "next/navigation";
import type { StepInfo } from "@/lib/questionnaire/steps";
import { ProgressRail } from "./ProgressRail";

export function ProgressRailWithPath({
  steps,
  lastCompletedSlug,
}: {
  steps: StepInfo[];
  lastCompletedSlug: string | null;
  /** Ignored — percent is derived from the current path so it stays in sync with Step X of Y. */
  percent?: number;
}) {
  const pathname = usePathname();
  const currentSlug = pathname.split("/").filter(Boolean).pop() ?? "client-info";
  const currentIdx = steps.findIndex((s) => s.slug === currentSlug);
  const percent =
    steps.length === 0
      ? 0
      : currentIdx >= 0
        ? Math.round(((currentIdx + 1) / steps.length) * 100)
        : 0;

  return (
    <ProgressRail
      steps={steps}
      currentSlug={currentSlug}
      lastCompletedSlug={lastCompletedSlug}
      percent={percent}
    />
  );
}
