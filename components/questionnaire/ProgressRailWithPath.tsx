"use client";

import { usePathname } from "next/navigation";
import type { StepInfo } from "@/lib/questionnaire/steps";
import { ProgressRail } from "./ProgressRail";

export function ProgressRailWithPath({
  steps,
  lastCompletedSlug,
  percent,
}: {
  steps: StepInfo[];
  lastCompletedSlug: string | null;
  percent: number;
}) {
  const pathname = usePathname();
  const currentSlug = pathname.split("/").filter(Boolean).pop() ?? "client-info";

  return (
    <ProgressRail
      steps={steps}
      currentSlug={currentSlug}
      lastCompletedSlug={lastCompletedSlug}
      percent={percent}
    />
  );
}
