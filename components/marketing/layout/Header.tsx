"use client";

import { NAV_LINKS } from "@/lib/marketing/content";
import { Brand } from "../ui/Brand";
import { PrimaryButton } from "../ui/PrimaryButton";

export function Header({
  navOpen,
  onToggleNav,
  onStart,
  onSignIn,
}: {
  navOpen: boolean;
  onToggleNav: () => void;
  onStart: () => void;
  onSignIn: () => void;
}) {
  return (
    <header className="header">
      <Brand />
      <nav className="header-nav" aria-label="Main navigation">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <button className="login-link" type="button" onClick={onSignIn}>
          Sign In
        </button>
      </nav>
      <PrimaryButton className="header-cta" onClick={onStart}>
        Start My Divorce
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
    </header>
  );
}
