"use client";

import { useId, useState } from "react";
import { FAQ_ITEMS } from "@/lib/marketing/content";
import { Icon } from "../ui/Icon";

export function FaqSection() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="ldd-faq" id="faq" aria-labelledby="faq-heading">
      <div className="ldd-faq__inner">
        <h2 id="faq-heading" className="ldd-faq__heading">
          FAQ
        </h2>

        <div className="ldd-faq__accordion">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const triggerId = `${baseId}-trigger-${index}`;
            const answerId = `${baseId}-answer-${index}`;

            return (
              <div
                key={item.question}
                className={["ldd-faq__item", isOpen ? "ldd-faq__item--open" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                <h3 className="ldd-faq__question">
                  <button
                    id={triggerId}
                    type="button"
                    className="ldd-faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => handleToggle(index)}
                  >
                    <span className="ldd-faq__question-text">{item.question}</span>
                    <span className="ldd-faq__toggle" aria-hidden="true">
                      <Icon name={isOpen ? "chevronUp" : "chevronDown"} size={16} />
                    </span>
                  </button>
                </h3>

                <div
                  id={answerId}
                  className="ldd-faq__answer"
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!isOpen}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}