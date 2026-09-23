"use client";
// @ts-nocheck

import { WHY_CARDS } from '@/lib/marketing/content';
import { IconWell } from '../ui/Icon';
import { PrimaryButton } from '../ui/PrimaryButton';

export function WhySection({ onStart }: { onStart: () => void }) {
  return (
    <section className="section why" id="why" aria-labelledby="why-heading">
      <div className="section-intro reveal">
        <p className="section-kicker">Why Legal Divorce Docs?</p>
        <h2 id="why-heading">Arizona Divorce Documents Made Simpler</h2>
      </div>

      <div className="why-grid">
        {WHY_CARDS.map((card) => (
          <article className="info-card reveal" key={card.title}>
            <IconWell name={card.icon} />
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>

      <div className="section-cta reveal">
        <PrimaryButton className="cta-strong" onClick={onStart}>
          Start My Divorce
        </PrimaryButton>
      </div>
    </section>
  );
}
