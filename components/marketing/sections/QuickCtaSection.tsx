"use client";

import { PrimaryButton } from "../ui/PrimaryButton";

export function QuickCtaSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="ldd-quick-cta" aria-labelledby="quick-cta-heading">
      <div className="ldd-quick-cta__inner">
        <h2 id="quick-cta-heading" className="ldd-quick-cta__title">
          See your divorce options in{" "}
          <span className="ldd-quick-cta__title-accent">under two minutes.</span>
        </h2>
        <p className="ldd-quick-cta__description">
          Answer just three simple questions to discover which divorce document preparation service
          is right for you.
        </p>
        <PrimaryButton type="button" className="ldd-quick-cta__button" onClick={onStart}>
          Find my options
        </PrimaryButton>
        <p className="ldd-quick-cta__note">No payment required.</p>
      </div>
    </section>
  );
}