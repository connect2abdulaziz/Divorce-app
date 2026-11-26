"use client";

import {
  PRICING_PACKAGES,
  PRICING_PACKAGES_HOME_ORDER,
  PRICING_PACKAGE_TAGLINES,
} from "@/lib/marketing/content";

const FEES_FOOTNOTE =
  "Arizona court filing fees, service-of-process fees, notary fees and other court or third-party charges are separate unless specifically stated otherwise.";

export function PricingSection({
  onStart,
}: {
  onStart: (helpPreference?: string | null) => void;
}) {
  const packages = PRICING_PACKAGES_HOME_ORDER.map(
    (id) => PRICING_PACKAGES.find((pkg) => pkg.id === id)!
  );

  return (
    <section className="ldd-pricing" id="pricing" aria-labelledby="pricing-heading">
      <header className="ldd-pricing__intro-block">
        <div className="ldd-pricing__intro-inner">
          <p className="ldd-pricing__eyebrow">Simple, upfront pricing</p>
          <h2 id="pricing-heading" className="ldd-pricing__heading">
            Choose the level of help that&apos;s right for you.
          </h2>
        </div>
      </header>

      {packages.map((pkg) => {
        const isGuided = pkg.id === "guided";
        const helpKey = isGuided ? "guided" : "online";

        return (
          <article
            key={pkg.id}
            className={
              isGuided
                ? "ldd-pricing__offer ldd-pricing__offer--guided"
                : "ldd-pricing__offer ldd-pricing__offer--diy"
            }
          >
            <div className="ldd-pricing__offer-inner">
              <span className="ldd-pricing__col-rule" aria-hidden="true" />

              <div className="ldd-pricing__summary">
                <p className="ldd-pricing__label">{pkg.name}</p>
                <h3 className="ldd-pricing__tagline">
                  {PRICING_PACKAGE_TAGLINES[pkg.id as keyof typeof PRICING_PACKAGE_TAGLINES]}
                </h3>
                <p className="ldd-pricing__price" aria-label={`Price ${pkg.price}`}>
                  {pkg.price}
                </p>
                <p className="ldd-pricing__blurb">{pkg.blurb}</p>
                <button
                  type="button"
                  className={
                    isGuided
                      ? "ldd-pricing__cta ldd-pricing__cta--solid"
                      : "ldd-pricing__cta ldd-pricing__cta--outline"
                  }
                  onClick={() => onStart(helpKey)}
                >
                  {pkg.cta}
                </button>
              </div>

              <div className="ldd-pricing__includes" aria-labelledby={`includes-${pkg.id}`}>
                <p id={`includes-${pkg.id}`} className="ldd-pricing__includes-label">
                  What&apos;s included
                </p>
                <ul className="ldd-pricing__feature-list">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="ldd-pricing__feature-item">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        );
      })}

      <div className="ldd-pricing__footnote-block">
        <p className="ldd-pricing__footnote">{FEES_FOOTNOTE}</p>
      </div>
    </section>
  );
}