"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, SERVICES_DROPDOWN_ITEMS } from "@/lib/marketing/content";
import { useMarketingSession } from "@/components/marketing/hooks/useMarketingSession";
import { PrimaryButton } from "../ui/PrimaryButton";
import { Icon } from "../ui/Icon";

export function MobileNav({
  open,
  onClose,
  onStart,
  onSignIn,
}: {
  open: boolean;
  onClose: () => void;
  onStart: (helpPreference?: string | null) => void;
  onSignIn: () => void;
}) {
  const { isAuthed, ready } = useMarketingSession();
  const [servicesOpen, setServicesOpen] = useState(false);

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
        <div className="mobile-nav-services">
          <button
            type="button"
            className="mobile-nav-services__trigger"
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen((current) => !current)}
          >
            <span>Services</span>
            <Icon name={servicesOpen ? "chevronUp" : "chevronDown"} size={16} />
          </button>
          <div className="mobile-nav-services__panel" hidden={!servicesOpen}>
            {SERVICES_DROPDOWN_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-nav-services__link"
                onClick={() => {
                  setServicesOpen(false);
                  onClose();
                }}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
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