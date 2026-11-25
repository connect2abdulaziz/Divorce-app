"use client";

import { usePathname } from "next/navigation";
import { questionnaireProgressFromSlug } from "@/lib/questionnaire/progress";
import type { StepInfo } from "@/lib/questionnaire/steps";

export function useQuestionnaireProgress(steps: StepInfo[]) {
  const pathname = usePathname();
  const currentSlug = pathname.split("/").filter(Boolean).pop() ?? "client-info";
  return { currentSlug, ...questionnaireProgressFromSlug(steps, currentSlug) };
}