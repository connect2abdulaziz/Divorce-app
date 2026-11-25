import type { PolicyDoc } from "@/lib/marketing/policies";
import { LegalContactCard } from "./LegalContactCard";
import { LegalDocument } from "./LegalDocument";
import { LegalMobileNav } from "./LegalMobileNav";
import { LegalPageHero } from "./LegalPageHero";
import { LegalSidebar } from "./LegalSidebar";

export function LegalPageLayout({ doc }: { doc: PolicyDoc }) {
  return (
    <div className="ldd-legal">
      <LegalPageHero doc={doc} />

      <section className="ldd-legal__main" aria-label={doc.title}>
        <div className="ldd-legal__inner">
          <LegalMobileNav doc={doc} />
          <div className="ldd-legal__workspace reveal">
            <LegalSidebar doc={doc} />
            <div className="ldd-legal__panel">
              <LegalDocument doc={doc} />
            </div>
          </div>
          <LegalContactCard className="ldd-legal-contact--mobile" />
        </div>
      </section>
    </div>
  );
}