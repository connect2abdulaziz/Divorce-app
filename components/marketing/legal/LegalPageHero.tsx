import { Icon } from "@/components/marketing/ui/Icon";
import type { PolicyDoc } from "@/lib/marketing/policies";

const HERO_ICONS: Record<PolicyDoc["slug"], "shield" | "document" | "refund" | "info"> = {
  privacy: "shield",
  terms: "document",
  refund: "refund",
  disclaimer: "info",
};

export function LegalPageHero({ doc }: { doc: PolicyDoc }) {
  const icon = HERO_ICONS[doc.slug];

  return (
    <section className="ldd-legal-hero" aria-labelledby="legal-hero-heading">
      <div className="ldd-legal-hero__inner">
        <div className="ldd-legal-hero__canvas reveal">
          <div className="ldd-legal-hero__grid">
            <div className="ldd-legal-hero__copy">
              <p className="ldd-legal-hero__eyebrow">Legal &amp; policies</p>
              <h1 id="legal-hero-heading">{doc.title}</h1>
              <p className="ldd-legal-hero__description">{doc.summary}</p>
            </div>
            <div className="ldd-legal-hero__icon-well" aria-hidden="true">
              <Icon name={icon} size={32} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}