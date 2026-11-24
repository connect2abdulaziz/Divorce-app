"use client";

import { useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect";
import { Spinner } from "@/components/ui/SubmitButton";
import { FormNotice } from "@/components/questionnaire/FormNotice";
import { submitQuestionnaire } from "@/lib/questionnaire/actions";

export function ReviewSubmitFooter({
  caseId,
  blockingErrors = [],
}: {
  caseId: string;
  blockingErrors?: string[];
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasBlockingErrors = blockingErrors.length > 0;

  function handleSubmit() {
    if (hasBlockingErrors) return;
    setSubmitError(null);
    startTransition(async () => {
      try {
        await submitQuestionnaire(caseId);
      } catch (e) {
        if (isRedirectError(e)) throw e;
        setSubmitError(e instanceof Error ? e.message : "Submit failed. Fix the issues above and try again.");
      }
    });
  }

  return (
    <>
      {hasBlockingErrors ? (
        <FormNotice variant="error" title="Fix these before submitting:">
          <ul className="ldd-q-review-errors">
            {blockingErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </FormNotice>
      ) : null}

      <label className="ldd-q-review-confirm">
        <input
          type="checkbox"
          className="ldd-q-review-confirm__input"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          disabled={isPending || hasBlockingErrors}
        />
        <span>
          I have reviewed the information above and confirm that it is complete and accurate to the
          best of my knowledge.
        </span>
      </label>

      <div className="ldd-q-card-footer ldd-q-card-footer--stack">
        {submitError ? <FormNotice variant="error">{submitError}</FormNotice> : null}
        <div className="ldd-q-card-footer__actions">
          <span />
          <button
            type="button"
            className="ldd-q-btn ldd-q-btn--primary"
            disabled={!confirmed || isPending || hasBlockingErrors}
            onClick={handleSubmit}
            aria-busy={isPending}
            title={
              hasBlockingErrors ? "Fix the issues listed above before submitting." : undefined
            }
          >
            {isPending ? (
              <span className="ldd-q-btn__pending">
                <Spinner />
                Submitting…
              </span>
            ) : (
              "Submit questionnaire"
            )}
          </button>
        </div>
      </div>
    </>
  );
}