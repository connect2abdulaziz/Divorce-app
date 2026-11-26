import {
  POLICY_SHOW_INLINE_TOC,
  type PolicyDoc,
} from "@/lib/marketing/policies";
import { LegalDocument } from "./LegalDocument";
import { LegalInlineToc } from "./LegalInlineToc";
import { LegalRelatedLinks } from "./LegalRelatedLinks";

export function LegalPageLayout({ doc }: { doc: PolicyDoc }) {
  const showInlineToc = POLICY_SHOW_INLINE_TOC.includes(doc.slug);

  return (
    <div className="ldd-legal-doc">
      <article className="ldd-legal-doc__article" aria-labelledby="legal-doc-title">
        <header className="ldd-legal-doc__header">
          <h1 id="legal-doc-title" className="ldd-legal-doc__title">
            {doc.title}
          </h1>
          <p className="ldd-legal-doc__summary">{doc.summary}</p>
          <hr className="ldd-legal-doc__rule ldd-legal-doc__rule--intro" />
        </header>

        {showInlineToc ? <LegalInlineToc doc={doc} /> : null}

        <LegalDocument doc={doc} />

        <footer className="ldd-legal-doc__footer">
          <hr className="ldd-legal-doc__rule ldd-legal-doc__rule--footer" />
          <LegalRelatedLinks currentSlug={doc.slug} />
        </footer>
      </article>
    </div>
  );
}