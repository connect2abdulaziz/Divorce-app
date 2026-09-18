"use client";
// @ts-nocheck

import { PrimaryButton } from '../ui/PrimaryButton';

export function ClosingSection({ onStart, loading = false }: { onStart: () => void; loading?: boolean }) {
  return (
    <section className="final-cta" aria-labelledby="final-heading">
      <div className="final-cta-inner reveal">
        <h2 id="final-heading">Ready to Start Your Arizona Divorce?</h2>
        <p>Answer a few questions about your situation and see which service fits your needs.</p>
        <PrimaryButton
          className="cta-strong"
          onClick={onStart}
          loading={loading}
          loadingLabel="Continuing…"
        >
          Start My Divorce
        </PrimaryButton>
        <p className="final-note">It only takes a few minutes to get started.</p>
      </div>
    </section>
  );
}
