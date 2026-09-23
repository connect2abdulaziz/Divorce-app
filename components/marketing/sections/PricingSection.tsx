"use client";
// @ts-nocheck

import { PRICING_PACKAGES } from '@/lib/marketing/content';
import { Icon } from '../ui/Icon';
import { PrimaryButton } from '../ui/PrimaryButton';

export function PricingSection({
  onStart,
}: {
  onStart: (helpPreference?: string | null) => void;
}) {
  return (
    <section className="section pricing" id="pricing" aria-labelledby="pricing-heading">
      <div className="section-intro reveal">
        <h2 id="pricing-heading">Choose the Level of Help That&apos;s Right for You</h2>
        <p>Simple, upfront pricing.</p>
      </div>

      <div className="pricing-grid">
        {PRICING_PACKAGES.map((pkg) => (
          <article
            className={pkg.popular ? 'pricing-card popular reveal' : 'pricing-card reveal'}
            key={pkg.id}
          >
            {pkg.popular ? <span className="popular-badge">Most Popular</span> : null}
            <h3>{pkg.name}</h3>
            <p className="pricing-amount">{pkg.price}</p>
            <p className="pricing-blurb">{pkg.blurb}</p>
            <ul className="pricing-features">
              {pkg.features.map((feature) => (
                <li key={feature}>
                  <Icon name="check" size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <PrimaryButton
              className="cta-strong"
              onClick={() => onStart(pkg.id === 'guided' ? 'guided' : 'online')}
            >
              {pkg.cta}
            </PrimaryButton>
          </article>
        ))}
      </div>

      <p className="pricing-footnote reveal">
        Arizona court filing fees, service-of-process fees, notary fees and other court or
        third-party charges are separate unless specifically stated otherwise.
      </p>
    </section>
  );
}
