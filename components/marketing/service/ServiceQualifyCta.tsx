"use client";

import { PrimaryButton } from "@/components/marketing/ui/PrimaryButton";

export function ServiceQualifyCta({ onStart }: { onStart: () => void }) {
  return (
    <section className="ldd-svc-qualify-cta" aria-labelledby="svc-qualify-cta-heading">
      <div className="ldd-svc-qualify-cta__inner">
        <h2 id="svc-qualify-cta-heading" className="ldd-svc-qualify-cta__title">
          Three questions. A clearer way forward.
        </h2>
        <p className="ldd-svc-qualify-cta__description">
          Discover which Arizona divorce document preparation service is right for your situation.
        </p>
        <PrimaryButton type="button" className="ldd-svc-qualify-cta__button" onClick={onStart}>
          Find my divorce options
        </PrimaryButton>
        <p className="ldd-svc-qualify-cta__note">No payment required to answer.</p>
      </div>
    </section>
  );
}