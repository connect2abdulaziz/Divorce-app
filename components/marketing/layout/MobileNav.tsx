"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/lib/marketing/content";
import { useMarketingSession } from "@/components/marketing/hooks/useMarketingSession";
import { PrimaryButton } from "../ui/PrimaryButton";

export function MobileNav({
  open,
  onClose,
  onStart,
  onSignIn,
}: {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
  onSignIn: () => void;
}) {
  const { isAuthed, ready } = useMarketingSession();

  return (
    <>
      <button
        type="button"
        className="mobile-nav-backdrop"
        aria-label="Close navigation"
        hidden={!open}
        onClick={onClose}
      />
      <nav id="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={onClose}>
            {link.label}
          </a>
        ))}
        {ready && isAuthed ? (
          <Link href="/dashboard" onClick={onClose}>
            Dashboard
          </Link>
        ) : (
          <button type="button" onClick={onSignIn}>
            Sign In
          </button>
        )}
        <PrimaryButton
          className="marketing-cta-primary"
          onClick={() => {
            onClose();
            onStart();
          }}
        >
          Start my divorce
        </PrimaryButton>
      </nav>
    </>
  );
}