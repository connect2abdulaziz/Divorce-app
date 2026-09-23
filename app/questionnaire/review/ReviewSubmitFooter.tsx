"use client";

import { useState, useTransition } from "react";
import { Spinner } from "@/components/ui/SubmitButton";
import { submitQuestionnaire } from "@/lib/questionnaire/actions";

export function ReviewSubmitFooter({ caseId }: { caseId: string }) {
  const [confirmed, setConfirmed] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      await submitQuestionnaire(caseId);
    });
  }

  return (
    <>
      <label className="flex items-start gap-3 border-t border-line/70 px-6 py-7 text-ink md:px-8">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-line text-accent focus:ring-accent"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          disabled={isPending}
        />
        <span>
          I have reviewed the information above and confirm that it is complete and accurate to the
          best of my knowledge.
        </span>
      </label>

      <div className="border-t border-line/70 bg-[#F7F6F1] px-6 py-5 md:px-8">
        <button
          type="button"
          className="btn-primary"
          disabled={!confirmed || isPending}
          onClick={handleSubmit}
          aria-busy={isPending}
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
