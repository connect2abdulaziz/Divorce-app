"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Brand } from "@/components/marketing/ui/Brand";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { userInitials } from "@/lib/dashboard/present";

type AutoSaveDetail = "idle" | "saving" | "saved" | "error";

export function QuestionnaireHeaderBar({
  userEmail,
  savedAtLabel,
  showAdmin,
  hasSavedTimestamp,
}: {
  userEmail: string;
  savedAtLabel: string;
  showAdmin: boolean;
  hasSavedTimestamp: boolean;
}) {
  const [autoSave, setAutoSave] = useState<AutoSaveDetail>("idle");
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const accountMenuId = useId();

  useEffect(() => {
    const onStatus = (e: Event) => {
      const detail = (e as CustomEvent<AutoSaveDetail>).detail;
      if (detail) setAutoSave(detail);
    };
    window.addEventListener("ldd-q-autosave-status", onStatus);
    return () => window.removeEventListener("ldd-q-autosave-status", onStatus);
  }, []);

  const closeAccount = useCallback(() => setAccountOpen(false), []);

  useEffect(() => {
    if (!accountOpen) return;

    const onPointer = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) closeAccount();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAccount();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen, closeAccount]);

  let saveText: string | null = null;
  let saveTitle: string | undefined;

  if (autoSave === "saving") {
    saveText = "Saving…";
  } else if (autoSave === "error") {
    saveText = "Save failed";
  } else if (autoSave === "saved" || hasSavedTimestamp) {
    saveText = "✓ Saved";
    if (hasSavedTimestamp && savedAtLabel) {
      saveTitle = `Last saved ${savedAtLabel}`;
    }
  }

  return (
    <div className="ldd-questionnaire-header__shell">
      <div className="ldd-dashboard-header__inner ldd-questionnaire-header__row">
        <div className="ldd-dashboard-header__brand">
          <Brand href="/dashboard" loading="eager" className="ldd-dashboard-header__logo" />
          <span className="ldd-dashboard-header__label">Client portal</span>
        </div>

        <div className="ldd-questionnaire-header__end">
          {saveText ? (
            <span
              className={`ldd-questionnaire-header__save ldd-questionnaire-header__save--${autoSave === "error" ? "error" : autoSave === "saving" ? "saving" : "ok"}`}
              title={saveTitle}
              aria-live="polite"
            >
              {saveText}
            </span>
          ) : null}

          <nav className="ldd-questionnaire-header__nav" aria-label="Questionnaire shortcuts">
            <Link href="/dashboard" className="ldd-questionnaire-header__nav-link">
              My questionnaires
            </Link>
            {showAdmin ? (
              <Link href="/admin" className="ldd-questionnaire-header__nav-link">
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="ldd-questionnaire-header__account" ref={accountRef}>
            <button
              type="button"
              className="ldd-questionnaire-header__account-trigger"
              aria-expanded={accountOpen}
              aria-controls={accountMenuId}
              aria-haspopup="true"
              onClick={() => setAccountOpen((o) => !o)}
            >
              <span className="ldd-dashboard-header__avatar" aria-hidden="true">
                {userInitials(userEmail)}
              </span>
              <span className="ldd-questionnaire-header__account-label">Account</span>
            </button>
            {accountOpen ? (
              <div id={accountMenuId} className="ldd-questionnaire-header__account-menu" role="dialog" aria-label="Account">
                <p className="ldd-questionnaire-header__account-email">{userEmail}</p>
                {hasSavedTimestamp && savedAtLabel ? (
                  <p className="ldd-questionnaire-header__account-saved">Last saved {savedAtLabel}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <SignOutButton className="ldd-dashboard-header__signout" />
        </div>
      </div>
    </div>
  );
}