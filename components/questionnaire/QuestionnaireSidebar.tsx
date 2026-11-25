"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  resolveSidebarIndices,
  sidebarStepState,
  type StepInfo,
} from "@/lib/questionnaire/steps";
import { QuestionnaireProgressIndicator } from "./QuestionnaireProgressIndicator";
import { useQuestionnaireProgress } from "./useQuestionnaireProgress";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 6.2 5 8.7l4.5-5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function QuestionnaireSidebar({
  steps,
  lastCompletedSlug,
}: {
  steps: StepInfo[];
  lastCompletedSlug: string | null;
}) {
  const pathname = usePathname();
  const currentSlug = pathname.split("/").filter(Boolean).pop() ?? "client-info";
  const { percent, stepLabel, stepLabelCompact } = useQuestionnaireProgress(steps);
  const { currentIndex, lastCompletedIndex } = resolveSidebarIndices(
    steps,
    currentSlug,
    lastCompletedSlug
  );

  useEffect(() => {
    const header = document.querySelector(".ldd-questionnaire-header");
    if (!header) return;

    const syncOffset = () => {
      const height = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--ldd-q-sticky-top", `${height + 12}px`);
    };

    syncOffset();
    const ro = new ResizeObserver(() => syncOffset());
    ro.observe(header);
    window.addEventListener("resize", syncOffset);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncOffset);
    };
  }, []);

  return (
    <nav
      className="ldd-questionnaire-sidebar"
      aria-label="Questionnaire sections"
    >
      <p className="ldd-questionnaire-sidebar__eyebrow">Your questionnaire</p>
      <QuestionnaireProgressIndicator
        percent={percent}
        stepLabel={stepLabel}
        stepLabelCompact={stepLabelCompact}
        variant="sidebar"
      />
      <ol className="ldd-questionnaire-sidebar__list">
        {steps.map((step, index) => {
          const state = sidebarStepState(index, currentIndex, lastCompletedIndex);
          const stepNumber = index + 1;

          return (
            <li key={step.slug} className="ldd-questionnaire-sidebar__item">
              <div
                className={`ldd-questionnaire-sidebar__row ldd-questionnaire-sidebar__row--${state}`}
                aria-current={state === "current" ? "step" : undefined}
              >
                <span
                  className={`ldd-questionnaire-sidebar__indicator ldd-questionnaire-sidebar__indicator--${state}`}
                  aria-hidden="true"
                >
                  {state === "completed" ? (
                    <CheckIcon />
                  ) : (
                    <span className="ldd-questionnaire-sidebar__number">{stepNumber}</span>
                  )}
                </span>
                <span className="ldd-questionnaire-sidebar__label">{step.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}