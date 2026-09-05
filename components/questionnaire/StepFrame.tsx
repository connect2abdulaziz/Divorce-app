"use client";

import Link from "next/link";
import { useTransition } from "react";
import { FormPanel } from "./FormPanel";

export function StepFrame({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  onContinue,
  children,
  continueLabel = "Save & continue",
}: {
  title: string;
  subtitle?: string;
  backHref: string | null;
  backLabel?: string;
  onContinue: () => Promise<void>;
  children: React.ReactNode;
  continueLabel?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleContinue() {
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

      <div className="flex items-center justify-between gap-4 border-t border-line/70 bg-[#F7F6F1] px-6 py-5 md:px-8">
        {backHref ? (
          <Link href={backHref} className="btn-secondary">
            {backLabel}
          </Link>
        ) : (
          <span />
        )}
        <button type="button" className="btn-primary" onClick={handleContinue} disabled={isPending}>
          {isPending ? "Saving…" : continueLabel}
        </button>
      </div>
    </FormPanel>
  );
}
