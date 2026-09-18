"use client";
// @ts-nocheck

import { NAV_LINKS } from '@/lib/marketing/content';
import { PrimaryButton } from '../ui/PrimaryButton';

export function MobileNav({
  open,
  onClose,
  onStart,
  onSignIn,
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
  onSignIn: () => void;
  loading?: boolean;
}) {
  return (
    <nav id="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
      {NAV_LINKS.map((link) => (
        <a key={link.href} href={link.href} onClick={onClose}>
          {link.label}
        </a>
      ))}
      <button type="button" onClick={onSignIn} disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </button>
      <PrimaryButton
        loading={loading}
        loadingLabel="Continuing…"
        onClick={() => {
          onClose();
          onStart();
        }}
      >
        Start My Divorce
      </PrimaryButton>
    </nav>
  );
}
