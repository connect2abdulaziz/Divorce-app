"use client";
// @ts-nocheck

import { ARIZONA_POINTS } from '@/lib/marketing/content';
import { Icon } from '../ui/Icon';
import { PrimaryButton } from '../ui/PrimaryButton';

export function ArizonaSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="section arizona" id="arizona" aria-labelledby="arizona-heading">
      <div className="arizona-panel reveal">
        <div className="arizona-copy">
          <h2 id="arizona-heading">Built for Arizona Divorce</h2>
          <p className="arizona-lead">Not a generic national document service.</p>
          <p>
            Legal Divorce Docs focuses on Arizona divorce document preparation. Our system is
            designed to collect the information needed for Arizona divorce documents and guide
            customers through the document preparation process.
          </p>
          <PrimaryButton className="cta-strong" onClick={onStart}>
            Start My Arizona Divorce
          </PrimaryButton>
        </div>

        <ul className="arizona-points">
          {ARIZONA_POINTS.map((point) => (
            <li key={point.label}>
              <Icon name={point.icon} size={20} />
              <span>{point.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
