"use client";

import Link from "next/link";
import {
  COURT_FEES_NOTE,
  getPricingPackage,
  SERVICE_ROUTES,
  type ServicePagePackageId,
} from "@/lib/marketing/content";

const ALT_COPY: Record<
  ServicePagePackageId,
  { eyebrow: string; title: string; description: string; cta: string; href: string }
> = {
  guided: {
    eyebrow: 'LOOKING FOR MORE SUPPORT?',
    title: 'Fully Guided Divorce',
    description:
      'If you would prefer additional personal assistance with document preparation, explore our Fully Guided service option.',
    cta: 'Explore Fully Guided',
    href: SERVICE_ROUTES.fullyGuided,
  },
  diy: {
    eyebrow: 'PREFER TO HANDLE MORE YOURSELF?',
    title: 'DIY Online Divorce',
    description:
      'If you are comfortable completing an online questionnaire and handling more of the divorce process independently, explore our DIY Online document preparation service.',
    cta: 'Explore DIY Online',
    href: SERVICE_ROUTES.diyOnline,
  },
};

export function ServiceAlternativePackage({
  promotePackageId = "guided",
}: {
  /** The other package promoted in this cross-sell section. */
  promotePackageId?: ServicePagePackageId;
}) {
  const pkg = getPricingPackage(promotePackageId);
  const copy = ALT_COPY[promotePackageId];

  return (
    <section className="ldd-svc-alt" aria-labelledby="svc-alt-heading">
      <div className="ldd-svc-alt__inner">
        <div className="ldd-svc-alt__col">
          <p className="ldd-svc-alt__eyebrow">{copy.eyebrow}</p>
          <h2 id="svc-alt-heading" className="ldd-svc-alt__title">
            {copy.title}
          </h2>
          <p className="ldd-svc-alt__description">{copy.description}</p>
        </div>
        <div className="ldd-svc-alt__divider" role="presentation" aria-hidden="true" />
        <div className="ldd-svc-alt__col ldd-svc-alt__col--action">
          <p className="ldd-svc-alt__price">{pkg.price}</p>
          <Link href={copy.href} className="ldd-svc-alt__cta">
            {copy.cta}
          </Link>
          <p className="ldd-svc-alt__fees-note">{COURT_FEES_NOTE}</p>
        </div>
      </div>
    </section>
  );
}