"use client";

import { ABOUT_VALUES, CLDP_INFO } from "@/lib/marketing/content";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PrimaryButton } from "@/components/marketing/ui/PrimaryButton";
import { useRouter } from "next/navigation";

export function AboutUsPage() {
  const router = useRouter();

  return (
    <MarketingShell>
      <section className="page-hero" aria-labelledby="about-heading">
        <div className="page-hero-inner reveal">
          <p className="section-kicker">About Us</p>
          <h1 id="about-heading">Arizona Divorce Document Preparation, Done Clearly</h1>
          <p>
            Legal Divorce Docs helps self-represented Arizonans prepare divorce documents online
            with a structured questionnaire and support from an Arizona Certified Legal Document
            Preparer.
          </p>
        </div>
      </section>

      <section className="section about-story" aria-labelledby="about-story-heading">
        <div className="about-story-grid">
          <div className="reveal">
            <h2 id="about-story-heading">Who We Are</h2>
            <p>
              We are a legal document preparation service focused on Arizona divorce cases. Our goal
              is to make the paperwork path easier to understand — with upfront pricing, a secure
              online questionnaire, and documents prepared from the information you provide.
            </p>
            <p>
              Legal Divorce Docs is not a law firm. We do not provide legal advice, legal strategy,
              or representation in court. If you need an attorney, you should consult a licensed
              Arizona lawyer.
            </p>
          </div>
          <aside className="about-callout reveal">
            <p className="about-callout-label">Prepared under</p>
            <p className="about-callout-name">{CLDP_INFO.name}</p>
            <p className="about-callout-cert">{CLDP_INFO.certification}</p>
          </aside>
        </div>
      </section>

      <section className="section about-values" aria-labelledby="about-values-heading">
        <div className="section-intro reveal">
          <h2 id="about-values-heading">What Guides Our Work</h2>
          <p>Clear process. Arizona focus. Honest limits on what document preparation can do.</p>
        </div>
        <div className="about-values-grid">
          {ABOUT_VALUES.map((item) => (
            <article className="info-card reveal" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta" aria-labelledby="about-cta-heading">
        <div className="final-cta-inner reveal">
          <h2 id="about-cta-heading">Ready to see if this fits your case?</h2>
          <p>Answer a few questions and start your Arizona divorce document questionnaire.</p>
          <PrimaryButton className="cta-strong" onClick={() => router.push("/#qualify")}>
            Start My Divorce
          </PrimaryButton>
        </div>
      </section>
    </MarketingShell>
  );
}
