import { HOW_IT_WORKS_STEPS } from "@/lib/marketing/content";

export function ProcessSection() {
  return (
    <section className="ldd-how-it-works" id="how-it-works" aria-labelledby="how-it-works-label">
      <div className="ldd-how-it-works__inner">
        <p id="how-it-works-label" className="ldd-how-it-works__eyebrow">
          How it works
        </p>

        <ol className="ldd-how-it-works__timeline">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <li key={step.title} className="ldd-how-it-works__step">
              <span className="ldd-how-it-works__marker" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="ldd-how-it-works__content">
                <h3 className="ldd-how-it-works__title">{step.title}</h3>
                <ul className="ldd-how-it-works__points">
                  <li className="ldd-how-it-works__point">{step.body}</li>
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}