"use client";

import { COMPARISON_ROWS } from "@/lib/marketing/content";
import { Icon } from "../ui/Icon";
import { PrimaryButton } from "../ui/PrimaryButton";

function ComparisonValue({
  value,
  variant,
}: {
  value: boolean | string;
  variant: "brand" | "light";
}) {
  if (value === true) {
    return (
      <span className="ldd-comparison__value">
        <Icon name="check" size={18} />
        <span>Yes</span>
      </span>
    );
  }

  if (value === false) {
    return (
      <span
        className={
          variant === "brand"
            ? "ldd-comparison__negative"
            : "ldd-comparison__negative ldd-comparison__negative--light"
        }
      >
        No
      </span>
    );
  }

  if (value === "$450") {
    return <span className="ldd-comparison__price">$450</span>;
  }

  return <span>{value}</span>;
}

export function ComparisonSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="ldd-comparison" id="comparison" aria-labelledby="comparison-heading">
      <div className="ldd-comparison__inner">
        <div className="ldd-comparison__intro reveal">
          <p className="ldd-comparison__eyebrow">Compare your options</p>
          <h2 id="comparison-heading" className="ldd-comparison__heading">
            <span>Different services.</span>
            <em>Different kinds of support.</em>
          </h2>
        </div>

        <div
          className="ldd-comparison__table-scroll reveal"
          role="region"
          aria-label="Service comparison"
          tabIndex={0}
        >
          <p className="ldd-comparison__table-scroll-hint">Scroll to compare</p>
          <div className="ldd-comparison__table-frame">
            <table className="ldd-comparison__table" aria-labelledby="comparison-heading">
              <colgroup>
                <col className="ldd-comparison__col-criteria" />
                <col className="ldd-comparison__col-brand" />
                <col className="ldd-comparison__col-attorney" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="ldd-comparison__criteria-label">What to expect</span>
                  </th>
                  <th scope="col" className="ldd-comparison__brand-cell">
                    <div className="ldd-comparison__service-heading ldd-comparison__service-heading--brand">
                      <Icon name="document" size={22} className="ldd-comparison__service-icon" />
                      <strong>Legal Divorce Docs</strong>
                      <span>Document preparation</span>
                    </div>
                  </th>
                  <th scope="col">
                    <div className="ldd-comparison__service-heading">
                      <Icon name="scale" size={22} className="ldd-comparison__service-icon ldd-comparison__service-icon--muted" />
                      <strong>Traditional Attorney</strong>
                      <span>Legal representation</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr
                    key={row.feature}
                    className={
                      row.feature === "Starting service price" ? "ldd-comparison__price-row" : undefined
                    }
                  >
                    <th scope="row">{row.feature}</th>
                    <td className="ldd-comparison__brand-cell">
                      <ComparisonValue value={row.us} variant="brand" />
                    </td>
                    <td>
                      <ComparisonValue value={row.attorney} variant="light" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ldd-comparison__footer reveal">
          <p className="ldd-comparison__disclaimer">
            Legal Divorce Docs is designed for self-represented Arizona customers who need document
            preparation assistance. If you need legal advice, legal strategy or representation,
            consult a licensed Arizona attorney.
          </p>

          <PrimaryButton className="ldd-comparison__cta" icon="chevronDown" onClick={onStart}>
            See which option fits my case
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}