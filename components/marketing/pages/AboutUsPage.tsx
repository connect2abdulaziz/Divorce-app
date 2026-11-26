"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ABOUT_VALUES, CLDP_INFO, SERVICE_ROUTES } from "@/lib/marketing/content";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ServiceBenefitsPanel } from "@/components/marketing/service/ServiceBenefitsPanel";
import { ServiceQualifyCta } from "@/components/marketing/service/ServiceQualifyCta";

const VALUE_ICON_MAP = {
  "Arizona focused": "pin",
  "Clear and upfront": "check",
  "Document preparation only": "document",
  "Human support available": "users",
} as const;

const ABOUT_BENEFITS = ABOUT_VALUES.map((item, index) => ({
  id: `about-value-${index}`,
  icon: VALUE_ICON_MAP[item.title as keyof typeof VALUE_ICON_MAP] ?? "check",
  title: item.title.toUpperCase(),
  body: item.body,
}));

export function AboutUsPage() {
  const router = useRouter();
  const startQualify = () => router.push("/#qualify");

  return (
    <MarketingShell>
      <div className="ldd-about-page">
        <section className="ldd-about-intro" aria-labelledby="about-heading">
          <div className="ldd-about-intro__inner">
            <div className="ldd-about-intro__col ldd-about-intro__col--main">
              <p className="ldd-about-intro__eyebrow">ABOUT US</p>
              <h1 id="about-heading" className="ldd-about-intro__title">
                Arizona divorce documents,
                <span className="ldd-about-intro__title-line">prepared clearly.</span>
              </h1>
              <p className="ldd-about-intro__lead">
                A clearer path through divorce paperwork for self-represented Arizonans.
              </p>
            </div>

            <div className="ldd-about-intro__divider" role="presentation" aria-hidden="true" />

            <div className="ldd-about-intro__col ldd-about-intro__col--support">
              <p className="ldd-about-intro__description">
                Legal Divorce Docs helps you prepare Arizona divorce documents online through a structured
                questionnaire. Your information is used to generate documents that reflect your
                circumstances — with upfront package pricing and a secure client account.
              </p>
              <p className="ldd-about-intro__description">
                {CLDP_INFO.certification
                  ? `Support is available from an ${CLDP_INFO.certification}.`
                  : "Assistance is available from an Arizona Certified Legal Document Preparer where applicable."}
              </p>
            </div>
          </div>
        </section>

        <section className="ldd-about-story" aria-labelledby="about-story-heading">
          <div className="ldd-about-story__inner">
            <p className="ldd-about-story__eyebrow">WHO WE ARE</p>
            <h2 id="about-story-heading" className="ldd-about-story__title">
              Making paperwork more manageable.
            </h2>
            <p className="ldd-about-story__text">
              We are a legal document preparation service focused on Arizona divorce cases. Our goal is to
              make the paperwork path easier to understand — with a guided online questionnaire, documents
              prepared from the information you provide, and clear limits on what we can and cannot do.
            </p>
            <hr className="ldd-about-story__rule" aria-hidden="true" />
            <div className="ldd-about-story__links">
              <Link href={SERVICE_ROUTES.diyOnline} className="ldd-about-story__link">
                DIY Online
              </Link>
              <span className="ldd-about-story__link-sep" aria-hidden="true" />
              <Link href={SERVICE_ROUTES.fullyGuided} className="ldd-about-story__link">
                Fully Guided
              </Link>
              <span className="ldd-about-story__link-sep" aria-hidden="true" />
              <Link href="/contact" className="ldd-about-story__link">
                Contact us
              </Link>
            </div>
          </div>
        </section>

        <ServiceBenefitsPanel
          heading="What guides our work."
          benefits={ABOUT_BENEFITS}
        />

        <section className="ldd-about-role" aria-labelledby="about-role-heading">
          <div className="ldd-about-role__inner">
            <h2 id="about-role-heading" className="ldd-about-role__title">
              Clear about what we do.
            </h2>
            <p className="ldd-about-role__lede">
              Legal Divorce Docs is a document preparation service — not a law firm.
            </p>
            <hr className="ldd-about-role__rule" aria-hidden="true" />
            <div className="ldd-about-role__grid">
              <div className="ldd-about-role__cell">
                <h3 className="ldd-about-role__cell-title">Document preparation</h3>
                <p className="ldd-about-role__cell-body">
                  We prepare Arizona divorce documents and share general procedural information based on the
                  details you provide through our questionnaire.
                </p>
              </div>
              <div className="ldd-about-role__cell">
                <h3 className="ldd-about-role__cell-title">Not legal advice</h3>
                <p className="ldd-about-role__cell-body">
                  We do not provide legal advice, legal strategy, or representation in court. An Arizona
                  Certified Legal Document Preparer cannot act as your attorney.
                </p>
              </div>
              <div className="ldd-about-role__cell">
                <h3 className="ldd-about-role__cell-title">When to consult a lawyer</h3>
                <p className="ldd-about-role__cell-body">
                  If you need legal advice or representation — including many contested or complex cases — you
                  should consult a licensed Arizona attorney.
                </p>
              </div>
              <div className="ldd-about-role__cell">
                <h3 className="ldd-about-role__cell-title">Arizona focused</h3>
                <p className="ldd-about-role__cell-body">
                  Our process is built for Arizona divorce document preparation, not a generic national forms
                  service.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ServiceQualifyCta onStart={startQualify} />
      </div>
    </MarketingShell>
  );
}