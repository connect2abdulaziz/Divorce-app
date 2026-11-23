"use client";

import type { PolicyDoc } from "@/lib/marketing/policies";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export function PolicyPage({ doc }: { doc: PolicyDoc }) {
  return (
    <MarketingShell>
      <section className="page-hero" aria-labelledby="policy-heading">
        <div className="page-hero-inner reveal">
          <p className="section-kicker">Policies</p>
          <h1 id="policy-heading">{doc.title}</h1>
          <p>{doc.summary}</p>
        </div>
      </section>

      <section className="section policy-body" aria-label={doc.title}>
        <div className="policy-prose reveal">
          {doc.sections.map((section) => (
            <article key={section.heading} className="policy-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
