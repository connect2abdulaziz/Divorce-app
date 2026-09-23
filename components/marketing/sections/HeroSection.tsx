"use client";

import { PrimaryButton } from "../ui/PrimaryButton";
import { TextLink } from "../ui/TextLink";

export function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-inner">
        <p className="hero-brand">Legal Divorce Docs</p>
        <h1 id="hero-heading">
          A Simpler Way to Start Your{" "}
          <br className="hero-break" />
          Arizona Divorce
        </h1>
        <p className="hero-lead">
          Prepare your Arizona divorce documents online with a simple step-by-step process and
          support from an Arizona Certified Legal Document{" "}
          <br className="hero-break" />
          Preparer.
        </p>
        <div className="hero-actions">
          <PrimaryButton className="cta-strong" onClick={onStart}>
            Start My Divorce
          </PrimaryButton>
          <TextLink href="#how-it-works">See How It Works</TextLink>
        </div>
        <p className="hero-trust">Arizona-Focused • Upfront Pricing • Secure Online Process</p>
        <p className="hero-disclaimer">
          Legal Divorce Docs is a legal document preparation service and is not a law firm. We do
          not{" "}
          <br className="hero-break" />
          provide legal advice or legal representation.
        </p>
      </div>
    </section>
  );
}
