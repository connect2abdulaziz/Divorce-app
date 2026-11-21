"use client";

import { useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect";
import { Spinner } from "@/components/ui/SubmitButton";
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
        <div className="space-y-2 border-t border-line/70 px-6 py-5 md:px-8">
          <p className="text-sm font-medium text-error">Fix these before submitting:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-error">
            {blockingErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <label className="flex items-start gap-3 border-t border-line/70 px-6 py-7 text-ink md:px-8">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-line text-accent focus:ring-accent"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          disabled={isPending || hasBlockingErrors}
        />
        <span>
          I have reviewed the information above and confirm that it is complete and accurate to the
          best of my knowledge.
        </span>
      </label>

      <div className="border-t border-line/70 bg-[#F7F6F1] px-6 py-5 md:px-8">
        {submitError ? <p className="mb-3 text-sm text-error">{submitError}</p> : null}
        <button
          type="button"
          className="btn-primary"
          disabled={!confirmed || isPending || hasBlockingErrors}
          onClick={handleSubmit}
          aria-busy={isPending}
          title={
            hasBlockingErrors
              ? "Fix the issues listed above before submitting."
              : undefined
          }
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              Submitting…
            </span>
          ) : (
            "Submit questionnaire"
          )}
        </button>
      </div>
    </>
  );
}
