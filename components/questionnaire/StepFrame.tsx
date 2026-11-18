"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/SubmitButton";
import { FormPanel } from "./FormPanel";

export function StepFrame({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  onContinue,
  children,
  continueLabel = "Save & continue",
  continueDisabled = false,
  continueDisabledReason,
}: {
  title: string;
  subtitle?: string;
  backHref: string | null;
  backLabel?: string;
  onContinue: () => Promise<void>;
  children: React.ReactNode;
  continueLabel?: string;
  /** When true, Save & continue cannot be clicked (e.g. unfinished Add form). */
  continueDisabled?: boolean;
  continueDisabledReason?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const blocked = continueDisabled || isPending;

  function handleContinue() {
    if (continueDisabled) return;
    startTransition(async () => {
      await onContinue();
    });
  }

  return (
    <FormPanel>
      <div className="border-b border-line/70 px-6 py-7 md:px-8">
        <h2 className="font-serif text-[1.75rem] font-semibold leading-tight text-ink">{title}</h2>
        {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-muted">{subtitle}</p>}
      </div>

      <div className="space-y-6 px-6 py-7 md:px-8">{children}</div>

      <div className="flex flex-col gap-3 border-t border-line/70 bg-[#F7F6F1] px-6 py-5 md:px-8">
        {continueDisabled && continueDisabledReason ? (
          <p className="text-sm text-muted">{continueDisabledReason}</p>
        ) : null}
        <div className="flex items-center justify-between gap-4">
          {backHref ? (
            <Link href={backHref} className="btn-secondary">
              {backLabel}
            </Link>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="btn-primary"
            onClick={handleContinue}
            disabled={blocked}
            aria-busy={isPending}
            title={continueDisabled ? continueDisabledReason : undefined}
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Saving…
              </span>
            ) : (
              continueLabel
            )}
          </button>
        </div>
      </div>
    </FormPanel>
  );
}
