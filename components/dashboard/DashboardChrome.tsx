"use client";

import { Brand } from "@/components/marketing/ui/Brand";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { userInitials } from "@/lib/dashboard/present";

export function DashboardChrome({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ldd-dashboard">
      <header className="ldd-dashboard-header">
        <div className="ldd-dashboard-header__inner">
          <div className="ldd-dashboard-header__brand">
            <Brand href="/dashboard" loading="eager" className="ldd-dashboard-header__logo" />
            <span className="ldd-dashboard-header__label">Client portal</span>
          </div>

          <div className="ldd-dashboard-header__account">
            <span className="ldd-dashboard-header__avatar" aria-hidden="true">
              {userInitials(userEmail)}
            </span>
            <span className="ldd-dashboard-header__email">{userEmail}</span>
            <SignOutButton className="ldd-dashboard-header__signout" />
          </div>
        </div>
      </header>

      <main className="ldd-dashboard__main">{children}</main>
    </div>
  );
}