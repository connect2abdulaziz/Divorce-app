"use client";

import { PrimaryButton } from "../ui/PrimaryButton";

export function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="ldd-hero" aria-labelledby="ldd-hero-title">
      <div className="ldd-hero__inner">
        <p className="ldd-hero__eyebrow">Arizona divorce document preparation</p>

        <h1 id="ldd-hero-title" className="ldd-hero__title">
          Arizona divorce documents,
          <span className="ldd-hero__title-break">
            <br aria-hidden="true" />
          </span>
          made simpler.
        </h1>

        <hr className="ldd-hero__rule" aria-hidden="true" />

        <p className="ldd-hero__description">
          Prepare your Arizona divorce documents online with a simple step-by-step process and
          support from an Arizona Certified Legal Document Preparer.
        </p>

        <div className="ldd-hero__actions">
          <PrimaryButton className="ldd-hero__cta-primary" onClick={onStart}>
            Start my divorce
          </PrimaryButton>
          <a className="ldd-hero__cta-secondary" href="#how-it-works">
            See how it works
          </a>
        </div>

        <p className="ldd-hero__disclaimer">
          Legal Divorce Docs is a legal document preparation service and is not a law firm. We do
          not provide legal advice or legal representation.
        </p>
      </div>
    </section>
  );
}