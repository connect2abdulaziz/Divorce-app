"use client";

import Link from "next/link";
import { Brand } from "@/components/marketing/ui/Brand";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { userInitials } from "@/lib/dashboard/present";

export function QuestionnaireHeaderBar({
  userEmail,
  savedAtLabel,
  showAdmin,
}: {
  userEmail: string;
  savedAtLabel: string;
  showAdmin: boolean;
}) {
  return (
    <div className="ldd-questionnaire-header__shell">
      <div className="ldd-dashboard-header__inner ldd-questionnaire-header__row">
        <div className="ldd-dashboard-header__brand">
          <Brand href="/dashboard" loading="eager" className="ldd-dashboard-header__logo" />
          <span className="ldd-dashboard-header__label">Client portal</span>
        </div>

        <div className="ldd-questionnaire-header__end">
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
          <span className="ldd-dashboard-header__avatar ldd-questionnaire-header__avatar" aria-hidden="true">
            {userInitials(userEmail)}
          </span>
          <SignOutButton className="ldd-dashboard-header__signout" />
        </div>
      </div>

      <div className="ldd-questionnaire-header__meta">
        <div className="ldd-questionnaire-header__meta-inner">
          <span className="ldd-questionnaire-header__saved" title="Last autosave">
            Saved {savedAtLabel}
          </span>
          <span className="ldd-questionnaire-header__meta-sep" aria-hidden="true">
            ·
          </span>
          <span className="ldd-questionnaire-header__email">{userEmail}</span>
        </div>
      </div>
    </div>
  );
}