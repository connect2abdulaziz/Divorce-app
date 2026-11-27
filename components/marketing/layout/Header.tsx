"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/lib/marketing/content";
import { useMarketingSession } from "@/components/marketing/hooks/useMarketingSession";
import { Brand } from "../ui/Brand";
import { PrimaryButton } from "../ui/PrimaryButton";
import { ServicesNavDropdown } from "./ServicesNavDropdown";

export function Header({
  navOpen,
  onToggleNav,
  onStart,
  onSignIn,
}: {
  navOpen: boolean;
  onToggleNav: () => void;
  onStart: (helpPreference?: string | null) => void;
  onSignIn: () => void;
}) {
  const { isAuthed, ready } = useMarketingSession();

  return (
    <header className="header">
      <div className="header-inner">
        <Brand />
        <nav className="header-nav" aria-label="Main navigation">
          <ServicesNavDropdown />
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {ready && isAuthed ? (
            <Link href="/dashboard" className="login-link">
              Dashboard
            </Link>
          ) : (
            <button className="login-link" type="button" onClick={onSignIn}>
              Sign In
            </button>
          )}
        </nav>
        <PrimaryButton
          className="header-cta marketing-cta-primary"
          onClick={() => onStart()}
        >
          Start my divorce
        </PrimaryButton>
        <button
          className="mobile-toggle"
          type="button"
          aria-label={navOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={navOpen}
          aria-controls="mobile-nav"
          onClick={onToggleNav}
        >
          <span className={navOpen ? "burger open" : "burger"} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}