"use client";
// @ts-nocheck

import { PROCESS_STEPS } from '@/lib/marketing/content';
import { PrimaryButton } from '../ui/PrimaryButton';

export function ProcessSection({ onStart, loading = false }: { onStart: () => void; loading?: boolean }) {
  return (
    <section className="section process" id="how-it-works" aria-labelledby="process-heading">
      <div className="section-intro reveal">
        <h2 id="process-heading">From Starting Your Case to Completing Your Divorce</h2>
      </div>

      <ol className="process-track">
        {PROCESS_STEPS.map((step, index) => (
          <li className="process-step reveal" key={step.number}>
            <span className="process-number">{step.number}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
            {index < PROCESS_STEPS.length - 1 ? (
              <span className="process-arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="section-cta reveal">
        <PrimaryButton
          className="cta-strong"
          onClick={onStart}
          loading={loading}
          loadingLabel="Continuing…"
        >
          Get Started
        </PrimaryButton>
      </div>
    </section>
  );
}
