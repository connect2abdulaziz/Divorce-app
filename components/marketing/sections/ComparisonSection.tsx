"use client";
// @ts-nocheck

import { COMPARISON_ROWS } from '@/lib/marketing/content';
import { PrimaryButton } from '../ui/PrimaryButton';

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span className="cmp-yes">Yes</span>;
  if (value === false) return <span className="cmp-no">No</span>;
  return <span>{value}</span>;
}

export function ComparisonSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="section comparison" id="comparison" aria-labelledby="comparison-heading">
      <div className="section-intro reveal">
        <h2 id="comparison-heading">A Different Alternative to Traditional Attorney Representation</h2>
      </div>

      <div className="comparison-wrap reveal">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col"> </th>
              <th scope="col">Legal Divorce Docs</th>
              <th scope="col">Traditional Attorney</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature}>
                <th scope="row">{row.feature}</th>
                <td>
                  <Cell value={row.us} />
                </td>
                <td>
                  <Cell value={row.attorney} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="comparison-note reveal">
        Legal Divorce Docs is designed for self-represented Arizona customers who need document
        preparation assistance. If you need legal advice, legal strategy or representation, consult
        a licensed Arizona attorney.
      </p>

      <div className="section-cta reveal">
        <PrimaryButton className="cta-strong" onClick={onStart}>
          See Which Option Fits My Case
        </PrimaryButton>
      </div>
    </section>
  );
}
