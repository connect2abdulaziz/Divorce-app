"use client";

import { PROCESS_STEPS, SERVICE_DETAILS } from "@/lib/marketing/content";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Icon } from "@/components/marketing/ui/Icon";
import { PrimaryButton } from "@/components/marketing/ui/PrimaryButton";
import { useRouter } from "next/navigation";

const SERVICE_PACKAGE_LABELS: Record<
  string,
  { title: string; descriptor: string }
> = {
  diy: {
    title: "DIY Online",
    descriptor: "Online Document Preparation",
  },
  guided: {
    title: "Fully Guided",
    descriptor: "Fully Guided Document Preparation",
  },
};

const FEES_FOOTNOTE =
  "Arizona court filing fees, service-of-process fees, notary fees, and other court or third-party charges are separate unless specifically stated otherwise.";

export function ServicesPage() {
  const router = useRouter();
  const start = () => router.push("/#qualify");

  return (
    <MarketingShell>
      <section className="ldd-services-hero" aria-labelledby="services-heading">
        <div className="ldd-services-hero__inner">
          <div className="ldd-services-hero__canvas reveal">
            <div className="ldd-services-hero__grid">
              <div className="ldd-services-hero__heading">
                <p className="ldd-services-hero__eyebrow">Our services</p>
                <h1 id="services-heading">
                  Arizona divorce document preparation. <em>On your terms.</em>
                </h1>
              </div>

              <div className="ldd-services-hero__support">
                <p className="ldd-services-hero__support-lead">
                  Two packages. Different levels of support.
                </p>
                <p className="ldd-services-hero__description">
                  Both packages prepare your divorce documents based on the information you provide
                  through our questionnaire.
                </p>
                <div className="ldd-services-hero__divider" role="presentation" />
                <div className="ldd-services-hero__disclaimer">
                  <Icon
                    name="info"
                    size={18}
                    className="ldd-services-hero__disclaimer-icon"
                  />
                  <p>
                    Neither package includes legal advice or attorney representation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ldd-services-packages" aria-labelledby="packages-heading">
        <div className="ldd-services-packages__inner">
          <div className="ldd-services-packages__intro reveal">
            <p className="ldd-services-packages__eyebrow">Our packages</p>
            <h2 id="packages-heading" className="ldd-services-packages__heading">
              Find the right <em>level of support.</em>
            </h2>
            <p className="ldd-services-packages__lede">
              Simple, upfront pricing for self-represented Arizona customers.
            </p>
          </div>

          <div className="ldd-services-packages__canvas reveal">
            {SERVICE_DETAILS.map((service) => {
              const labels = SERVICE_PACKAGE_LABELS[service.id] ?? {
                title: service.name,
                descriptor: service.name,
              };
              const isGuided = service.id === "guided";

              return (
                <article
                  key={service.id}
                  className={[
                    "ldd-services-packages__package",
                    isGuided
                      ? "ldd-services-packages__package--guided"
                      : "ldd-services-packages__package--diy",
                  ].join(" ")}
                >
                  <header className="ldd-services-packages__header">
                    <h3 className="ldd-services-packages__name">{labels.title}</h3>
                    <p className="ldd-services-packages__price">{service.price}</p>
                    <p className="ldd-services-packages__descriptor">{labels.descriptor}</p>
                  </header>

                  <div className="ldd-services-packages__overview">
                    <p className="ldd-services-packages__label">Package overview</p>
                    <p className="ldd-services-packages__text">{service.summary}</p>
                  </div>

                  <div className="ldd-services-packages__best-for">
                    <p className="ldd-services-packages__label">Best for</p>
                    <p className="ldd-services-packages__text">{service.bestFor}</p>
                  </div>

                  <div className="ldd-services-packages__features">
                    <p className="ldd-services-packages__label">Inclusions</p>
                    <ul className="ldd-services-packages__feature-list">
                      {service.includes.map((item) => (
                        <li key={item}>
                          <Icon name="check" size={18} className="ldd-services-packages__check" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="ldd-services-packages__actions">
                    {isGuided ? (
                      <PrimaryButton
                        className="ldd-services-packages__button ldd-services-packages__button--solid"
                        icon="chevronDown"
                        onClick={start}
                      >
                        Get started — {service.price}
                      </PrimaryButton>
                    ) : (
                      <button
                        type="button"
                        className="ldd-services-packages__button ldd-services-packages__button--outline"
                        onClick={start}
                      >
                        Get started — {service.price}
                        <Icon name="chevronDown" size={18} className="ldd-services-packages__button-icon" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <p className="ldd-services-packages__footnote reveal">
            <Icon name="info" size={16} className="ldd-services-packages__footnote-icon" aria-hidden="true" />
            <span>{FEES_FOOTNOTE}</span>
          </p>
        </div>
      </section>

      <section className="ldd-services-process" aria-labelledby="services-process-heading">
        <div className="ldd-services-process__container">
          <header className="ldd-services-process__header reveal">
            <p className="ldd-services-process__eyebrow">How it works</p>
            <h2 id="services-process-heading" className="ldd-services-process__heading">
              A clear process. <em>One step at a time.</em>
            </h2>
            <p className="ldd-services-process__lede">
              From questionnaire to prepared documents — then you review, sign, and file.
            </p>
          </header>

          <ol className="ldd-services-process__timeline">
            {PROCESS_STEPS.map((step, index) => (
              <li className="ldd-services-process__step reveal" key={step.number}>
                <span className="ldd-services-process__marker" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="ldd-services-process__step-content">
                  <h3 className="ldd-services-process__step-title">{step.title}</h3>
                  <p className="ldd-services-process__step-description">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ldd-services-final-cta" aria-labelledby="services-cta-heading">
        <div className="ldd-services-final-cta__inner">
          <div className="ldd-services-final-cta__card reveal">
            <div className="ldd-services-final-cta__copy">
              <p className="ldd-services-final-cta__eyebrow">Take the next step</p>
              <h2 id="services-cta-heading" className="ldd-services-final-cta__heading">
                Not sure which package <em>is right for you?</em>
              </h2>
              <p className="ldd-services-final-cta__description">
                Answer a few questions about your situation and find the service that fits your needs.
              </p>
            </div>
            <div className="ldd-services-final-cta__action">
              <PrimaryButton
                className="ldd-services-final-cta__button"
                icon="chevronDown"
                onClick={start}
              >
                Start my divorce
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
