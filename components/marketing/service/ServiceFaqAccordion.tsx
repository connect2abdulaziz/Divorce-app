"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ServiceFaqItem } from "@/lib/marketing/content";
import { Icon } from "@/components/marketing/ui/Icon";

export function ServiceFaqAccordion({
  items,
  heading = "Frequently Asked Questions",
  id = "svc-faq",
}: {
  items: ServiceFaqItem[];
  heading?: string;
  id?: string;
}) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="ldd-svc-faq" id={id} aria-labelledby={`${id}-heading`}>
      <div className="ldd-svc-faq__inner">
        <h2 id={`${id}-heading`} className="ldd-svc-faq__heading">
          {heading}
        </h2>

        <div className="ldd-svc-faq__accordion">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const triggerId = `${baseId}-trigger-${index}`;
            const answerId = `${baseId}-answer-${index}`;

            return (
              <div
                key={item.question}
                className={["ldd-svc-faq__item", isOpen ? "ldd-svc-faq__item--open" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                <h3 className="ldd-svc-faq__question">
                  <button
                    id={triggerId}
                    type="button"
                    className="ldd-svc-faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="ldd-svc-faq__question-text">{item.question}</span>
                    <span className="ldd-svc-faq__toggle" aria-hidden="true">
                      <Icon name={isOpen ? "chevronUp" : "chevronDown"} size={16} />
                    </span>
                  </button>
                </h3>

                <div
                  id={answerId}
                  className="ldd-svc-faq__answer"
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!isOpen}
                >
                  <p>
                    {item.answer}
                    {item.link ? (
                      <>
                        {" "}
                        <Link href={item.link.href}>{item.link.label}</Link>.
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}