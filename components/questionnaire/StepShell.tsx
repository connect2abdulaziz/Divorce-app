"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Spinner } from "@/components/ui/SubmitButton";
import { FormPanel } from "./FormPanel";
import { RequiredFieldsLegend } from "./FormNotice";

export function StepShell({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  onSubmit,
  onAutoSave,
  children,
  submitLabel = "Save & continue",
  showRequiredLegend = true,
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
  showRequiredLegend?: boolean;
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
        <div className="ldd-q-card-header">
          <div className="ldd-q-card-header__main">
            <h2 className="ldd-q-card-title">{title}</h2>
            {subtitle ? <p className="ldd-q-card-subtitle">{subtitle}</p> : null}
          </div>
          {onAutoSave ? (
            <p className="ldd-q-autosave" aria-live="polite">
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

        <div className="ldd-q-card-body">
          {showRequiredLegend ? (
            <div className="ldd-q-card-body__legend">
              <RequiredFieldsLegend />
            </div>
          ) : null}
          {children}
        </div>

        <div className="ldd-q-card-footer">
          {backHref ? (
            <Link href={backHref} className="ldd-q-btn ldd-q-btn--secondary">
              {backLabel}
            </Link>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="ldd-q-btn ldd-q-btn--primary"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (
              <span className="ldd-q-btn__pending">
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