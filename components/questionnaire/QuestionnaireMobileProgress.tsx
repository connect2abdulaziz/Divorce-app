"use client";

import type { StepInfo } from "@/lib/questionnaire/steps";
import { QuestionnaireProgressIndicator } from "./QuestionnaireProgressIndicator";
import { useQuestionnaireProgress } from "./useQuestionnaireProgress";

export function QuestionnaireMobileProgress({ steps }: { steps: StepInfo[] }) {
  const { percent, stepLabel, stepLabelCompact } = useQuestionnaireProgress(steps);

  return (
    <div className="ldd-questionnaire-header__mobile-progress">
      <QuestionnaireProgressIndicator
        percent={percent}
        stepLabel={stepLabel}
        stepLabelCompact={stepLabelCompact}
        variant="mobile"
      />
    </div>
  );
}