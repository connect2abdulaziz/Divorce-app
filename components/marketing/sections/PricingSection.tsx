"use client";

import { PRICING_PACKAGES } from "@/lib/marketing/content";
import { Icon } from "../ui/Icon";
import { PrimaryButton } from "../ui/PrimaryButton";

export function PricingSection({
  onStart,
}: {
  onStart: (helpPreference?: string | null) => void;
}) {
  return (
    <section className="ldd-pricing" id="pricing" aria-labelledby="pricing-heading">
      <div className="ldd-pricing__inner">
        <div className="ldd-pricing__layout reveal">
          <div className="ldd-pricing__intro">
            <p className="ldd-pricing__eyebrow">Simple, upfront pricing</p>
            <h2 id="pricing-heading" className="ldd-pricing__heading">
              <span>Choose the level of help</span>
              <em>that&apos;s right for you.</em>
            </h2>
          </div>

          <div className="ldd-pricing__grid">
          {PRICING_PACKAGES.map((pkg) => {
            const isGuided = pkg.id === "guided";
            return (
              <article
                className={
                  isGuided
                    ? "ldd-pricing__card ldd-pricing__card--guided reveal"
                    : "ldd-pricing__card ldd-pricing__card--online reveal"
                }
                key={pkg.id}
              >
                <header className="ldd-pricing__card-header">
                  <p className="ldd-pricing__plan">{pkg.name}</p>
                  {pkg.popular ? (
                    <span className="ldd-pricing__badge">Most popular</span>
                  ) : null}
                </header>

                <p className="ldd-pricing__price">{pkg.price}</p>
                <p className="ldd-pricing__description">{pkg.blurb}</p>

                <hr className="ldd-pricing__divider" aria-hidden="true" />

                <ul className="ldd-pricing__features">
                  {pkg.features.map((feature) => (
                    <li className="ldd-pricing__feature" key={feature}>
                      <Icon name="check" size={18} className="ldd-pricing__check" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="ldd-pricing__card-footer">
                  {isGuided ? (
                    <PrimaryButton
                      className="ldd-pricing__cta ldd-pricing__cta--solid"
                      icon="chevronDown"
                      onClick={() => onStart("guided")}
                    >
                      {pkg.cta}
                    </PrimaryButton>
                  ) : (
                    <button
                      type="button"
                      className="ldd-pricing__cta ldd-pricing__cta--outline"
                      onClick={() => onStart("online")}
                    >
                      {pkg.cta}
                      <Icon name="chevronDown" size={18} className="ldd-pricing__cta-icon" />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
          </div>
        </div>

        <p className="ldd-pricing__footnote reveal">
          Arizona court filing fees, service-of-process fees, notary fees and other court or
          third-party charges are separate unless specifically stated otherwise.
        </p>
      </div>
    </section>
  );
}