import { policySectionId, type PolicyDoc } from "@/lib/marketing/policies";

export function LegalInlineToc({ doc }: { doc: PolicyDoc }) {
  return (
    <nav className="ldd-legal-doc__toc" aria-labelledby="legal-toc-heading">
      <h2 id="legal-toc-heading" className="ldd-legal-doc__toc-heading">
        On this page
      </h2>
      <ul className="ldd-legal-doc__toc-list">
        {doc.sections.map((section) => {
          const id = policySectionId(section.heading);
          return (
            <li key={section.heading}>
              <a className="ldd-legal-doc__toc-link" href={`#${id}`}>
                {section.heading}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}