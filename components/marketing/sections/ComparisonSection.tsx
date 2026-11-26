"use client";

import { Fragment } from "react";
import { Icon } from "../ui/Icon";

const COMPARISON_POINTS = [
  {
    brand: "Guided online questionnaire",
    alternative: "Identify the appropriate forms independently",
  },
  {
    brand: "Document preparation support",
    alternative: "Complete your paperwork manually",
  },
  {
    brand: "Options based on your circumstances",
    alternative: "Determine which documents apply to your situation",
  },
  {
    brand: "Complete information at your own pace",
    alternative: "Research document requirements independently",
  },
] as const;

function ComparisonRow({
  text,
  icon,
  isLast,
}: {
  text: string;
  icon: "check" | "cross";
  isLast: boolean;
}) {
  return (
    <div
      className={[
        "ldd-comparison__row",
        isLast ? "ldd-comparison__row--last" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="ldd-comparison__row-icon" aria-hidden="true">
        {icon === "check" ? (
          <Icon name="check" size={18} />
        ) : (
          <Icon name="close" size={16} />
        )}
      </span>
      <span className="ldd-comparison__row-text">{text}</span>
    </div>
  );
}

export function ComparisonSection() {
  return (
    <section className="ldd-comparison" id="comparison" aria-labelledby="comparison-heading">
      <div className="ldd-comparison__inner">
        <header className="ldd-comparison__intro">
          <p className="ldd-comparison__eyebrow">Compare your options</p>
          <h2 id="comparison-heading" className="ldd-comparison__heading">
            A simpler way to prepare your divorce paperwork.
          </h2>
        </header>

        <div className="ldd-comparison__board" role="region" aria-label="Service comparison">
          <span className="ldd-comparison__rule" aria-hidden="true" />

          <h3 className="ldd-comparison__col-heading ldd-comparison__col-heading--brand">
            Legal Divorce Docs
          </h3>
          <h3 className="ldd-comparison__col-heading ldd-comparison__col-heading--alt">
            Preparing on your own
          </h3>

          {COMPARISON_POINTS.map((point, index) => {
            const isLast = index === COMPARISON_POINTS.length - 1;
            const gridRow = index + 2;

            return (
              <Fragment key={point.brand}>
                <div
                  className={[
                    "ldd-comparison__row-slot",
                    "ldd-comparison__row-slot--brand",
                    index === 0 ? "ldd-comparison__row-slot--first" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ gridRow }}
                >
                  <ComparisonRow text={point.brand} icon="check" isLast={isLast} />
                </div>
                <div
                  className={[
                    "ldd-comparison__row-slot",
                    "ldd-comparison__row-slot--alt",
                    index === 0 ? "ldd-comparison__row-slot--first" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ gridRow }}
                >
                  <ComparisonRow text={point.alternative} icon="cross" isLast={isLast} />
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}