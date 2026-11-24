"use client";

import Image from "next/image";
import { PrimaryButton } from "../ui/PrimaryButton";

const CLOSING_IMAGE = "/assets/campaign-new-chapter.webp";

export function ClosingSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="ldd-final-cta" aria-labelledby="final-cta-heading">
      <div className="ldd-final-cta__inner">
        <div className="ldd-final-cta__banner reveal">
          <div className="ldd-final-cta__content">
            <p className="ldd-final-cta__eyebrow">Your next chapter</p>

            <h2 id="final-cta-heading">
              Moving forward begins with <em>one step.</em>
            </h2>

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

          <div className="ldd-final-cta__media">
            <Image
              src={CLOSING_IMAGE}
              alt="A man and woman walking separately beside classical stone columns"
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              className="ldd-final-cta__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}