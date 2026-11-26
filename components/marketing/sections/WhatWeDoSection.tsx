const PATH_STEPS = [
  { label: "Tell us about your situation", active: true },
  { label: "Choose your service", active: false },
  { label: "Complete your information", active: false },
  { label: "Receive your documents", active: false },
] as const;

export function WhatWeDoSection() {
  return (
    <section className="ldd-what-we-do" aria-labelledby="what-we-do-heading">
      <div className="ldd-what-we-do__inner">
        <div className="ldd-what-we-do__layout">
          <div className="ldd-what-we-do__copy">
            <p className="ldd-what-we-do__eyebrow">What we do</p>
            <h2 id="what-we-do-heading" className="ldd-what-we-do__heading">
              Divorce paperwork doesn&apos;t have to be complicated.
            </h2>
            <p className="ldd-what-we-do__description">
              We help individuals prepare their Arizona divorce documents through a guided online
              process, with options based on their family circumstances, property and document
              preparation needs.
            </p>
          </div>

          <aside className="ldd-what-we-do__path" aria-labelledby="path-forward-label">
            <p id="path-forward-label" className="ldd-what-we-do__path-label">
              Your path forward
            </p>
            <ol className="ldd-what-we-do__steps">
              {PATH_STEPS.map((step) => (
                <li
                  key={step.label}
                  className={
                    step.active ? "ldd-what-we-do__step is-active" : "ldd-what-we-do__step"
                  }
                >
                  <span className="ldd-what-we-do__marker-wrap">
                    <span className="ldd-what-we-do__marker" aria-hidden="true" />
                  </span>
                  <span className="ldd-what-we-do__step-label">{step.label}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}