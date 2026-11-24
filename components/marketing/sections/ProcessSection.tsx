"use client";

import { PROCESS_STEPS } from "@/lib/marketing/content";
import { PrimaryButton } from "../ui/PrimaryButton";

export function ProcessSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="ldd-process" id="how-it-works" aria-labelledby="process-heading">
      <div className="ldd-process__container">
        <header className="ldd-process__header reveal">
          <div className="ldd-process__header-inner">
            <div className="ldd-process__intro">
              <p className="ldd-process__eyebrow">How it works</p>
              <h2 id="process-heading" className="ldd-process__heading">
                From starting your case to <em>completing your divorce.</em>
              </h2>
            </div>
            <PrimaryButton className="ldd-process__cta" icon="chevronDown" onClick={onStart}>
              Get started
            </PrimaryButton>
          </div>
        </header>

        <ol className="ldd-process__timeline">
          {PROCESS_STEPS.map((step, index) => (
            <li className="ldd-process__step" key={step.number}>
              <span className="ldd-process__marker" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="ldd-process__step-content">
                <h3 className="ldd-process__step-title">{step.title}</h3>
                <p className="ldd-process__step-description">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}