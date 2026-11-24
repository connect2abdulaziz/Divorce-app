"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/SubmitButton";
import { FormPanel } from "./FormPanel";
import { RequiredFieldsLegend } from "./FormNotice";

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
  showRequiredLegend = true,
}: {
  title: string;
  subtitle?: string;
  backHref: string | null;
  backLabel?: string;
  onContinue: () => Promise<void>;
  children: React.ReactNode;
  continueLabel?: string;
  continueDisabled?: boolean;
  continueDisabledReason?: string;
  showRequiredLegend?: boolean;
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
      <div className="ldd-q-card-header">
        <div className="ldd-q-card-header__main">
          <h2 className="ldd-q-card-title">{title}</h2>
          {subtitle ? <p className="ldd-q-card-subtitle">{subtitle}</p> : null}
        </div>
      </div>

      <div className="ldd-q-card-body">
        {showRequiredLegend ? (
          <div className="ldd-q-card-body__legend">
            <RequiredFieldsLegend />
          </div>
        ) : null}
        {children}
      </div>

      <div className="ldd-q-card-footer ldd-q-card-footer--stack">
        {continueDisabled && continueDisabledReason ? (
          <p className="ldd-q-footer-hint">{continueDisabledReason}</p>
        ) : null}
        <div className="ldd-q-card-footer__actions">
          {backHref ? (
            <Link href={backHref} className="ldd-q-btn ldd-q-btn--secondary">
              {backLabel}
            </Link>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="ldd-q-btn ldd-q-btn--primary"
            onClick={handleContinue}
            disabled={blocked}
            aria-busy={isPending}
            title={continueDisabled ? continueDisabledReason : undefined}
          >
            {isPending ? (
              <span className="ldd-q-btn__pending">
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