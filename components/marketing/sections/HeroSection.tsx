"use client";

import Image from "next/image";
import { PrimaryButton } from "../ui/PrimaryButton";
import { TextLink } from "../ui/TextLink";
import { Icon } from "../ui/Icon";

const HERO_IMAGE = "/assets/campaign-justice.webp";

const HERO_FEATURES = [
  {
    icon: "pin",
    title: "Arizona focused",
    description: "State-specific documents",
  },
  {
    icon: "document",
    title: "Upfront pricing",
    description: "Clear service costs",
  },
  {
    icon: "compass",
    title: "Guided process",
    description: "Step-by-step preparation",
  },
] as const;

export function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="ldd-hero" aria-labelledby="ldd-hero-title">
      <div className="ldd-hero__canvas">
        <div className="ldd-hero__content">
          <span className="ldd-hero__eyebrow">Arizona divorce document preparation</span>

          <h1 id="ldd-hero-title" className="ldd-hero__title">
            Arizona divorce documents, <em>made simpler.</em>
          </h1>

          <p className="ldd-hero__description">
            Prepare your Arizona divorce documents online with a simple step-by-step process and
            support from an Arizona Certified Legal Document Preparer.
          </p>

          <div className="ldd-hero__actions">
            <PrimaryButton className="ldd-hero__cta-primary" icon="chevronDown" onClick={onStart}>
              Start my divorce
            </PrimaryButton>
            <TextLink className="ldd-hero__cta-secondary" href="#how-it-works">
              See how it works
            </TextLink>
          </div>
        </div>

        <div className="ldd-hero__visual-slot">
          <div className="ldd-hero__visual">
            <Image
              src={HERO_IMAGE}
              alt="Representative editorial photograph for the homepage; not a depiction of a specific consultation."
              fill
              priority
              sizes="(min-width: 1024px) min(46vw, 560px), 100vw"
              className="ldd-hero__visual-img"
            />
          </div>
        </div>

        <div className="ldd-hero__notch">
          <div className="ldd-hero__features">
            {HERO_FEATURES.map((feature) => (
              <div className="ldd-hero__feature" key={feature.title}>
                <span className="ldd-hero__feature-icon" aria-hidden="true">
                  <Icon name={feature.icon} size={22} />
                </span>
                <p className="ldd-hero__feature-title">{feature.title}</p>
                <p className="ldd-hero__feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="ldd-hero__disclaimer">
        Legal Divorce Docs is a legal document preparation service and is not a law firm. We do not
        provide legal advice or legal representation.
      </p>
    </section>
  );
}