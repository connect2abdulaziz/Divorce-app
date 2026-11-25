import type { CSSProperties } from "react";

export function QuestionnaireProgressIndicator({
  percent,
  stepLabel,
  stepLabelCompact,
  variant,
}: {
  percent: number;
  stepLabel: string | null;
  stepLabelCompact: string | null;
  variant: "sidebar" | "mobile";
}) {
  const width = `${Math.min(100, Math.max(0, percent))}%`;
  const fillStyle = { width } satisfies CSSProperties;

  const progressAria = stepLabel ?? "Questionnaire progress";

  if (variant === "mobile") {
    return (
      <div className="ldd-q-progress-strip">
        <div className="ldd-q-progress-strip__row">
          {stepLabelCompact ? (
            <p className="ldd-q-progress-strip__step">
              <span className="sr-only">{stepLabel}</span>
              <span aria-hidden="true">{stepLabelCompact}</span>
            </p>
          ) : (
            <span />
          )}
          <p className="ldd-q-progress-strip__percent" aria-label="Completion progress">
            {percent}%
          </p>
        </div>
        <div
          className="ldd-q-progress-strip__track"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={progressAria}
        >
          <div className="ldd-q-progress-strip__fill" style={fillStyle} />
        </div>
      </div>
    );
  }

  return (
    <div className="ldd-q-progress-card">
      <div className="ldd-q-progress-card__head">
        {stepLabelCompact ? (
          <p className="ldd-q-progress-card__step">
            <span className="sr-only">{stepLabel}</span>
            <span aria-hidden="true">{stepLabelCompact}</span>
          </p>
        ) : (
          <span />
        )}
        <p className="ldd-q-progress-card__percent" aria-label="Completion progress">
          {percent}%
        </p>
      </div>
      <div
        className="ldd-q-progress-card__track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={progressAria}
      >
        <div className="ldd-q-progress-card__fill" style={fillStyle} />
      </div>
    </div>
  );
}