"use client";

import { PrimaryButton } from "../ui/PrimaryButton";
import { TextLink } from "../ui/TextLink";
import { Icon } from "../ui/Icon";

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

const HERO_PANEL_STEPS = [
  {
    number: "01",
    title: "Check your eligibility",
    description:
      "Understand whether our document preparation service is suitable for your situation.",
  },
  {
    number: "02",
    title: "Complete your questionnaire",
    description: "Provide your information through our guided, step-by-step process.",
  },
  {
    number: "03",
    title: "Get your documents prepared",
    description: "Your information is used to prepare your Arizona divorce documents.",
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
          <aside
            className="ldd-hero__visual ldd-hero__service-panel"
            aria-labelledby="ldd-hero-panel-heading"
          >
            <div className="ldd-hero__panel-head">
              <p className="ldd-hero__panel-eyebrow">A clear path forward</p>
              <h2 id="ldd-hero-panel-heading" className="ldd-hero__panel-title">
                <span className="ldd-hero__panel-title-line ldd-hero__panel-title-line--primary">
                  Divorce paperwork.
                </span>
                <span className="ldd-hero__panel-title-line ldd-hero__panel-title-line--accent">
                  <em>Without the complexity.</em>
                </span>
              </h2>
              <div className="ldd-hero__panel-head-rule" role="presentation" />
            </div>

            <ol className="ldd-hero__panel-steps">
              {HERO_PANEL_STEPS.map((step, index) => (
                <li key={step.number} className="ldd-hero__panel-step">
                  <span className="ldd-hero__panel-step-num" aria-hidden="true">
                    {step.number}
                  </span>
                  <div
                    className={`ldd-hero__panel-step-body${index > 0 ? " ldd-hero__panel-step-body--divided" : ""}`}
                  >
                    <h3 className="ldd-hero__panel-step-title">{step.title}</h3>
                    <p className="ldd-hero__panel-step-desc">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="ldd-hero__panel-cred">
              <span className="ldd-hero__panel-cred-icon" aria-hidden="true">
                <Icon name="shield" size={22} />
              </span>
              <div className="ldd-hero__panel-cred-copy">
                <p className="ldd-hero__panel-cred-title">Arizona Certified Legal Document Preparer</p>
                <p className="ldd-hero__panel-cred-sub">Professional document preparation support</p>
              </div>
            </div>
          </aside>
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