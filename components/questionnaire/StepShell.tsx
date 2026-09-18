"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/SubmitButton";
import { FormPanel } from "./FormPanel";

export function StepShell({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  onSubmit,
  children,
  submitLabel = "Save & continue",
}: {
  title: string;
  subtitle?: string;
  backHref: string | null;
  backLabel?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await onSubmit(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn-primary" disabled={isPending} aria-busy={isPending}>
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Saving…
              </span>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </FormPanel>
    </form>
  );
}
