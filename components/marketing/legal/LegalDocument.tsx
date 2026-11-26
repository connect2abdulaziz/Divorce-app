import { policySectionId, type PolicyDoc } from "@/lib/marketing/policies";

export function LegalDocument({ doc }: { doc: PolicyDoc }) {
  return (
    <div className="ldd-legal-doc__body">
      {doc.sections.map((section) => {
        const sectionId = policySectionId(section.heading);

        return (
          <section
            key={section.heading}
            id={sectionId}
            className="ldd-legal-section"
            aria-labelledby={`${sectionId}-heading`}
          >
            <h2 id={`${sectionId}-heading`} className="ldd-legal-section__title">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="ldd-legal-section__p">
                {paragraph}
              </p>
            ))}
          </section>
        );
      })}
    </div>
  );
}