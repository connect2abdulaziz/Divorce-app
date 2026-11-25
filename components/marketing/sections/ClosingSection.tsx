"use client";

import { PrimaryButton } from "../ui/PrimaryButton";

export function ClosingSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="ldd-final-cta" aria-labelledby="final-cta-heading">
      <div className="ldd-final-cta__inner">
        <div className="ldd-final-cta__shell reveal">
          <div className="ldd-final-cta__banner">
            <div className="ldd-final-cta__col ldd-final-cta__col--heading">
              <p className="ldd-final-cta__eyebrow">Take the first step</p>
              <h2 id="final-cta-heading" className="ldd-final-cta__heading">
                <span className="ldd-final-cta__heading-line">Ready to start your</span>
                <span className="ldd-final-cta__heading-line">
                  Arizona <em>divorce?</em>
                </span>
              </h2>
            </div>

            <div className="ldd-final-cta__col ldd-final-cta__col--action">
              <p className="ldd-final-cta__description">
                Answer a few questions about your situation and see which service fits your needs.
              </p>

              <div className="ldd-final-cta__actions">
                <PrimaryButton
                  className="ldd-final-cta__button"
                  icon="chevronDown"
                  onClick={onStart}
                >
                  Start my divorce
                </PrimaryButton>

                <p className="ldd-final-cta__reassurance">
                  It only takes a few minutes to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}