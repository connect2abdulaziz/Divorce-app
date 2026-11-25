import { Icon } from "@/components/marketing/ui/Icon";
import {
  POLICY_CALLOUT_SECTION_ID,
  policySectionId,
  type PolicyDoc,
} from "@/lib/marketing/policies";

export function LegalDocument({ doc }: { doc: PolicyDoc }) {
  const calloutId = POLICY_CALLOUT_SECTION_ID[doc.slug];

  return (
    <article className="ldd-legal-read" aria-labelledby="legal-doc-title">
      <h2 id="legal-doc-title" className="sr-only">
        {doc.title}
      </h2>
      {doc.sections.map((section, index) => {
        const sectionId = policySectionId(section.heading);
        const isCallout = calloutId === sectionId;
        const sectionNumber = String(index + 1).padStart(2, "0");

        return (
          <section
            key={section.heading}
            id={sectionId}
            className={`ldd-legal-section${index > 0 ? " ldd-legal-section--divided" : ""}`}
            aria-labelledby={`${sectionId}-heading`}
          >
            {isCallout ? (
              <div className="ldd-legal-callout">
                <Icon name="info" size={20} className="ldd-legal-callout__icon" />
                <div className="ldd-legal-callout__body">
                  <h2 id={`${sectionId}-heading`} className="ldd-legal-callout__title">
                    <span className="ldd-legal-section__number" aria-hidden="true">
                      {sectionNumber}
                    </span>
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h2 id={`${sectionId}-heading`} className="ldd-legal-section__title">
                  <span className="ldd-legal-section__number" aria-hidden="true">
                    {sectionNumber}
                  </span>
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="ldd-legal-section__p">
                    {paragraph}
                  </p>
                ))}
              </>
            )}
          </section>
        );
      })}
    </article>
  );
}