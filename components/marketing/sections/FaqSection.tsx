"use client";

import { useId, useState } from "react";
import { FAQ_ITEMS } from "@/lib/marketing/content";

export function FaqSection() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section faq" id="faq" aria-labelledby="faq-heading">
      <div className="section-intro reveal">
        <h2 id="faq-heading">Frequently Asked Questions</h2>
      </div>

      <div className="faq-list">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `${baseId}-panel-${index}`;
          const buttonId = `${baseId}-button-${index}`;

          return (
            <div
              className="faq-item reveal"
              data-open={isOpen ? "true" : undefined}
              key={item.question}
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  {item.question}
                  <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
