import type { ReactNode } from "react";

/** Semibold question prompt for Yes/No and decision fields — pass `required` only when validation requires an answer. */
export function QuestionBlock({
  children,
  required,
  hint,
  className = "",
}: {
  children: ReactNode;
  required?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={`ldd-q-question ${className}`.trim()}>
      <p className="ldd-q-question__label">
        {children}
        {required ? <span className="ldd-q-required" aria-hidden="true"> *</span> : null}
      </p>
      {hint ? <p className="ldd-q-question__hint">{hint}</p> : null}
    </div>
  );
}