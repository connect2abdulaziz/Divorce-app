"use client";

import { PrimaryButton } from "../ui/PrimaryButton";

export function ClosingSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="ldd-final-cta" aria-labelledby="final-cta-heading">
      <div className="ldd-final-cta__inner">
        <p className="ldd-final-cta__eyebrow">Take the first step</p>

        <h2 id="final-cta-heading" className="ldd-final-cta__heading">
          Your next chapter starts here.
        </h2>

        <hr className="ldd-final-cta__rule" aria-hidden="true" />

        <p className="ldd-final-cta__description">
          Answer three simple questions to explore your Arizona divorce document preparation
          options.
        </p>

        <PrimaryButton type="button" className="ldd-final-cta__button" onClick={onStart}>
          Find my options
        </PrimaryButton>

        <p className="ldd-final-cta__note">No payment required to answer.</p>
      </div>
    </section>
  );
}