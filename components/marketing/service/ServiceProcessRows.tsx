import { DIY_SERVICE_PROCESS_STEPS } from "@/lib/marketing/content";

type ProcessStep = { title: string; body: string };

export function ServiceProcessRows({
  title = "A clear process, one step at a time.",
  steps = DIY_SERVICE_PROCESS_STEPS,
  footnote,
}: {
  title?: string;
  steps?: readonly ProcessStep[];
  footnote?: string;
}) {
  return (
    <section className="ldd-svc-process" aria-labelledby="svc-process-heading">
      <div className="ldd-svc-process__inner">
        <h2 id="svc-process-heading" className="ldd-svc-process__title">
          {title}
        </h2>
        <p className="ldd-svc-process__eyebrow">WHAT TO EXPECT</p>

        <ol className="ldd-svc-process__list">
          {steps.map((step, index) => (
            <li key={step.title} className="ldd-svc-process__item">
              <div className="ldd-svc-process__row">
                <h3 className="ldd-svc-process__step-title">
                  {index + 1}. {step.title}
                </h3>
                <p className="ldd-svc-process__step-body">
                  <span className="ldd-svc-process__bullet" aria-hidden="true" />
                  {step.body}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <hr className="ldd-svc-process__rule" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
        {footnote ? <p className="ldd-svc-process__footnote">{footnote}</p> : null}
      </div>
    </section>
  );
}