"use client";

import { WHY_CARDS } from "@/lib/marketing/content";
import { Icon } from "../ui/Icon";

export function WhySection({ onStart }: { onStart: () => void }) {
  return (
    <section className="ldd-benefits" id="why" aria-labelledby="why-heading">
      <div className="ldd-benefits__layout reveal">
        <div className="ldd-benefits__intro">
          <p className="ldd-benefits__eyebrow">Why Legal Divorce Docs?</p>
          <h2 id="why-heading" className="ldd-benefits__heading">
            <span>Divorce documents.</span>
            <span>Less complexity.</span>
            <em>More clarity.</em>
          </h2>
          <p className="ldd-benefits__description">
            Arizona-focused document preparation with a straightforward online process.
          </p>
          <button type="button" className="ldd-benefits__cta" onClick={onStart}>
            Start my divorce
            <Icon name="chevronDown" size={16} className="ldd-benefits__cta-icon" />
          </button>
        </div>

        <div className="ldd-benefits__grid">
          {WHY_CARDS.map((card) => (
            <article className="ldd-benefits__item" key={card.title}>
              <span className="ldd-benefits__icon" aria-hidden="true">
                <Icon name={card.icon} size={25} />
              </span>
              <h3 className="ldd-benefits__title">{card.title}</h3>
              <p className="ldd-benefits__text">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}