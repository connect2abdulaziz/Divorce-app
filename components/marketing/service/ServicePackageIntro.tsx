"use client";

import {
  COURT_FEES_NOTE,
  getPricingPackage,
  type ServicePageIntroConfig,
  type ServicePagePackageId,
} from "@/lib/marketing/content";
import { Icon } from "@/components/marketing/ui/Icon";
import { PrimaryButton } from "@/components/marketing/ui/PrimaryButton";

export function ServicePackageIntro({
  packageId,
  intro,
  onStartPackage,
}: {
  packageId: ServicePagePackageId;
  intro: ServicePageIntroConfig;
  onStartPackage: () => void;
}) {
  const pkg = getPricingPackage(packageId);

  return (
    <section className="ldd-svc-intro" aria-labelledby="svc-intro-heading">
      <div className="ldd-svc-intro__inner">
        <div className="ldd-svc-intro__col ldd-svc-intro__col--main">
          <p className="ldd-svc-intro__eyebrow">{intro.eyebrow}</p>
          <h1 id="svc-intro-heading" className="ldd-svc-intro__title">
            {intro.headline.split("\n").map((line, index) => (
              <span key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h1>
          <p className="ldd-svc-intro__price">{pkg.price}</p>
          <p className="ldd-svc-intro__fees-note">{COURT_FEES_NOTE}</p>
          <hr className="ldd-svc-intro__rule" aria-hidden="true" />
          <p className="ldd-svc-intro__description">{intro.description}</p>
          <PrimaryButton type="button" className="ldd-svc-intro__cta" onClick={onStartPackage}>
            {pkg.cta}
          </PrimaryButton>
        </div>

        <div className="ldd-svc-intro__divider" role="presentation" aria-hidden="true" />

        <div className="ldd-svc-intro__col ldd-svc-intro__col--features">
          <h2 className="ldd-svc-intro__includes-label">WHAT&apos;S INCLUDED?</h2>
          <ul className="ldd-svc-intro__feature-list">
            {intro.features.map((feature) => (
              <li key={feature}>
                <Icon name="check" size={20} className="ldd-svc-intro__check" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}