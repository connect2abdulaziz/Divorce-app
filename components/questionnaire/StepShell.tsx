"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Spinner } from "@/components/ui/SubmitButton";
import { FormPanel } from "./FormPanel";

export function StepShell({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  onSubmit,
  onAutoSave,
  children,
  submitLabel = "Save & continue",
}: {
  title: string;
  subtitle?: string;
  backHref: string | null;
  backLabel?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  /** Debounced background save — do not advance progress. */
  onAutoSave?: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [autoStatus, setAutoStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipAutoSaveRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function scheduleAutoSave() {
    if (!onAutoSave || skipAutoSaveRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const form = formRef.current;
      if (!form) return;
      setAutoStatus("saving");
      try {
        await onAutoSave(new FormData(form));
        setAutoStatus("saved");
      } catch {
        setAutoStatus("error");
      }
    }, 1200);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    skipAutoSaveRef.current = true;
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await onSubmit(formData);
      } finally {
        skipAutoSaveRef.current = false;
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={scheduleAutoSave}
      onInput={scheduleAutoSave}
    >
      <FormPanel>
        <div className="border-b border-line/70 px-6 py-7 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-[1.75rem] font-semibold leading-tight text-ink">{title}</h2>
              {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-muted">{subtitle}</p>}
            </div>
            {onAutoSave ? (
              <p className="shrink-0 pt-1 text-xs text-muted" aria-live="polite">
                {autoStatus === "saving"
                  ? "Saving…"
                  : autoStatus === "saved"
                    ? "Saved"
                    : autoStatus === "error"
                      ? "Save failed"
                      : null}
              </p>
            ) : null}
          </div>
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
