"use client";

import { PROCESS_STEPS, SERVICE_DETAILS } from "@/lib/marketing/content";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Icon } from "@/components/marketing/ui/Icon";
import { PrimaryButton } from "@/components/marketing/ui/PrimaryButton";
import { useRouter } from "next/navigation";

export function ServicesPage() {
  const router = useRouter();
  const start = () => router.push("/#qualify");

  return (
    <MarketingShell>
      <section className="page-hero" aria-labelledby="services-heading">
        <div className="page-hero-inner reveal">
          <p className="section-kicker">Services</p>
          <h1 id="services-heading">Arizona Divorce Document Preparation Services</h1>
          <p>
            Choose the level of help that matches your situation. Both packages prepare Arizona
            divorce documents from your questionnaire answers. Neither package includes legal advice
            or attorney representation.
          </p>
        </div>
      </section>

      <section className="section services-list" aria-labelledby="packages-heading">
        <div className="section-intro reveal">
          <h2 id="packages-heading">Our Packages</h2>
          <p>Simple, upfront pricing for self-represented Arizona customers.</p>
        </div>

        <div className="services-detail-grid">
          {SERVICE_DETAILS.map((service) => (
            <article className="service-detail-card reveal" key={service.id}>
              <div className="service-detail-top">
                <h3>{service.name}</h3>
                <p className="pricing-amount">{service.price}</p>
                <p className="pricing-blurb">{service.summary}</p>
                <p className="service-best-for">
                  <strong>Best for:</strong> {service.bestFor}
                </p>
              </div>
              <ul className="pricing-features">
                {service.includes.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <PrimaryButton className="cta-strong" onClick={start}>
                Get Started — {service.price}
              </PrimaryButton>
            </article>
          ))}
        </div>

        <p className="pricing-footnote reveal">
          Arizona court filing fees, service-of-process fees, notary fees, and other court or
          third-party charges are separate unless specifically stated otherwise.
        </p>
      </section>

      <section className="section process" aria-labelledby="services-process-heading">
        <div className="section-intro reveal">
          <h2 id="services-process-heading">How the Process Works</h2>
          <p>From questionnaire to prepared documents — then you review, sign, and file.</p>
        </div>
        <ol className="process-track">
          {PROCESS_STEPS.map((step) => (
            <li className="process-step reveal" key={step.number}>
              <span className="process-number">{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="final-cta" aria-labelledby="services-cta-heading">
        <div className="final-cta-inner reveal">
          <h2 id="services-cta-heading">Not sure which package you need?</h2>
          <p>Answer a few questions about your situation and we will point you in the right direction.</p>
          <PrimaryButton className="cta-strong" onClick={start}>
            Start My Divorce
          </PrimaryButton>
        </div>
      </section>
    </MarketingShell>
  );
}
