"use client";

import { ABOUT_VALUES } from "@/lib/marketing/content";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Icon } from "@/components/marketing/ui/Icon";
import { PrimaryButton } from "@/components/marketing/ui/PrimaryButton";
import { useRouter } from "next/navigation";

const VALUE_ICONS: Record<string, "pin" | "check" | "document" | "users"> = {
  "Arizona focused": "pin",
  "Clear and upfront": "check",
  "Document preparation only": "document",
  "Human support available": "users",
};

export function AboutUsPage() {
  const router = useRouter();
  const start = () => router.push("/#qualify");

  return (
    <MarketingShell>
      <section className="ldd-about-hero" aria-labelledby="about-heading">
        <div className="ldd-about-hero__inner">
          <div className="ldd-about-hero__canvas reveal">
            <div className="ldd-about-hero__grid">
              <div className="ldd-about-hero__heading">
                <p className="ldd-about-hero__eyebrow">About us</p>
                <h1 id="about-heading">
                  Arizona divorce document preparation. <em>Done clearly.</em>
                </h1>
              </div>

              <div className="ldd-about-hero__support">
                <p className="ldd-about-hero__support-lead">
                  A clearer path through divorce paperwork.
                </p>
                <p className="ldd-about-hero__description">
                  Legal Divorce Docs helps self-represented Arizonans prepare divorce documents online
                  with a structured questionnaire and support from an Arizona Certified Legal Document
                  Preparer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ldd-about-story" aria-labelledby="about-story-heading">
        <div className="ldd-about-story__inner">
          <div className="ldd-about-story__layout reveal">
            <div className="ldd-about-story__intro">
              <p className="ldd-about-story__eyebrow">Who we are</p>
              <h2 id="about-story-heading" className="ldd-about-story__heading">
                Making paperwork <em>more manageable.</em>
              </h2>
              <p className="ldd-about-story__text">
                We are a legal document preparation service focused on Arizona divorce cases. Our goal
                is to make the paperwork path easier to understand — with upfront pricing, a secure
                online questionnaire, and documents prepared from the information you provide.
              </p>
            </div>

            <aside className="ldd-about-story__panel">
              <Icon name="scale" size={32} className="ldd-about-story__panel-icon" />
              <p className="ldd-about-story__panel-eyebrow">Our role</p>
              <h3 className="ldd-about-story__panel-heading">Clear about what we do.</h3>
              <p className="ldd-about-story__panel-text">
                Legal Divorce Docs is not a law firm. We do not provide legal advice, legal strategy, or
                representation in court.
              </p>
              <div className="ldd-about-story__panel-divider" role="presentation" />
              <p className="ldd-about-story__panel-text">
                If you need an attorney, you should consult a licensed Arizona lawyer.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="ldd-about-values" aria-labelledby="about-values-heading">
        <div className="ldd-about-values__container">
          <header className="ldd-about-values__intro reveal">
            <p className="ldd-about-values__eyebrow">Our values</p>
            <h2 id="about-values-heading" className="ldd-about-values__heading">
              What guides <em>our work.</em>
            </h2>
            <p className="ldd-about-values__lede">
              Clear process. Arizona focus. Honest limits on what document preparation can do.
            </p>
          </header>

          <ul className="ldd-about-values__grid">
            {ABOUT_VALUES.map((item, index) => (
              <li className="ldd-about-values__item reveal" key={item.title}>
                <div className="ldd-about-values__item-meta">
                  <Icon
                    name={VALUE_ICONS[item.title] ?? "check"}
                    size={28}
                    className="ldd-about-values__icon"
                  />
                  <span className="ldd-about-values__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="ldd-about-values__title">{item.title}</h3>
                <p className="ldd-about-values__body">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ldd-about-final-cta" aria-labelledby="about-cta-heading">
        <div className="ldd-about-final-cta__inner">
          <div className="ldd-about-final-cta__banner reveal">
            <div className="ldd-about-final-cta__copy">
              <p className="ldd-about-final-cta__eyebrow">Take the next step</p>
              <h2 id="about-cta-heading" className="ldd-about-final-cta__heading">
                Ready to see if this <em>fits your case?</em>
              </h2>
              <p className="ldd-about-final-cta__description">
                Answer a few questions and start your Arizona divorce document questionnaire.
              </p>
            </div>
            <div className="ldd-about-final-cta__action">
              <PrimaryButton
                className="ldd-about-final-cta__button"
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