const WHY_CHOOSE_ROWS = [
  {
    title: "Transparent, upfront pricing",
    description:
      "Know what your selected document preparation service costs before proceeding.",
  },
  {
    title: "Arizona-focused document preparation",
    description: "Documents prepared for your specific Arizona divorce circumstances.",
  },
  {
    title: "A simple, guided online process",
    description: "Complete your information through a straightforward, step-by-step questionnaire.",
  },
  {
    title: "Options for different family situations",
    description: "Find suitable document preparation options based on children, property and debt.",
  },
  {
    title: "Professional document preparation",
    description: "Receive support from an Arizona Certified Legal Document Preparer.",
  },
] as const;

export function WhySection() {
  return (
    <section className="ldd-why-choose" id="why" aria-labelledby="why-choose-heading">
      <div className="ldd-why-choose__panel">
        <h2 id="why-choose-heading" className="ldd-why-choose__kicker">
          Why choose Legal Divorce Docs
        </h2>

        <div className="ldd-why-choose__rows">
          {WHY_CHOOSE_ROWS.map((row) => (
            <div className="ldd-why-choose__row" key={row.title}>
              <div className="ldd-why-choose__title-col">
                <span className="ldd-why-choose__bullet" aria-hidden="true" />
                <p className="ldd-why-choose__benefit-title">{row.title}</p>
              </div>
              <p className="ldd-why-choose__detail">{row.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}