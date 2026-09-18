"use client";
// @ts-nocheck

import { PrimaryButton } from '../ui/PrimaryButton';
import { TextLink } from '../ui/TextLink';

export function HeroSection({ onStart, loading = false }: { onStart: () => void; loading?: boolean }) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-inner">
        <p className="hero-brand">Legal Divorce Docs</p>
        <h1 id="hero-heading">A Simpler Way to Start Your Arizona Divorce</h1>
        <p className="hero-lead">
          Prepare your Arizona divorce documents online with a simple step-by-step process and
          support from an Arizona Certified Legal Document Preparer.
        </p>
        <div className="hero-actions">
          <PrimaryButton
            className="cta-strong"
            onClick={onStart}
            loading={loading}
            loadingLabel="Continuing…"
          >
            Start My Divorce
          </PrimaryButton>
          <TextLink href="#how-it-works">See How It Works</TextLink>
        </div>
        <p className="hero-trust">Arizona-Focused • Upfront Pricing • Secure Online Process</p>
        <p className="hero-disclaimer">
          Legal Divorce Docs is a legal document preparation service and is not a law firm. We do
          not provide legal advice or legal representation.
        </p>
      </div>
    </section>
  );
}
