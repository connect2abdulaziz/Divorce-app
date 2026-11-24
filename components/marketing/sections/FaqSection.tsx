"use client";

import Link from "next/link";
import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { FAQ_ITEMS } from "@/lib/marketing/content";

const FAQ_DESKTOP_MQ = "(min-width: 901px)";

export function FaqSection() {
  const baseId = useId();
  const accordionRef = useRef<HTMLDivElement>(null);
  const openIndexRef = useRef<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [collapsedAccordionHeight, setCollapsedAccordionHeight] = useState<number | undefined>(
    undefined,
  );

  openIndexRef.current = openIndex;

  const measureCollapsedAccordionHeight = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia(FAQ_DESKTOP_MQ).matches) {
      setCollapsedAccordionHeight(undefined);
      return;
    }
    const accordion = accordionRef.current;
    if (!accordion) return;
    setCollapsedAccordionHeight(Math.round(accordion.getBoundingClientRect().height));
  }, []);

  useLayoutEffect(() => {
    if (openIndex !== null) return;
    measureCollapsedAccordionHeight();
  }, [openIndex, measureCollapsedAccordionHeight]);

  useLayoutEffect(() => {
    const accordion = accordionRef.current;
    if (!accordion) return;

    const resizeObserver = new ResizeObserver(() => {
      if (openIndexRef.current !== null) return;
      measureCollapsedAccordionHeight();
    });
    resizeObserver.observe(accordion);

    const desktopMq = window.matchMedia(FAQ_DESKTOP_MQ);
    const handleViewportChange = () => {
      if (openIndexRef.current !== null) {
        if (!desktopMq.matches) {
          setCollapsedAccordionHeight(undefined);
        }
        return;
      }
      measureCollapsedAccordionHeight();
    };

    window.addEventListener("resize", handleViewportChange);
    desktopMq.addEventListener("change", handleViewportChange);
    measureCollapsedAccordionHeight();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleViewportChange);
      desktopMq.removeEventListener("change", handleViewportChange);
    };
  }, [measureCollapsedAccordionHeight]);

  const handleToggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const introHeightStyle =
    collapsedAccordionHeight !== undefined
      ? { height: collapsedAccordionHeight, minHeight: collapsedAccordionHeight }
      : undefined;

  return (
    <section className="ldd-faq" id="faq" aria-labelledby="faq-heading">
      <div className="ldd-faq__inner">
        <div className="ldd-faq__layout">
          <div className="ldd-faq__intro reveal" style={introHeightStyle}>
            <div className="ldd-faq__intro-content">
              <p className="ldd-faq__eyebrow">Frequently asked questions</p>

              <h2 id="faq-heading">
                A little more <em>clarity.</em>
              </h2>

              <p className="ldd-faq__description">
                Find answers to common questions about Arizona divorce document preparation.
              </p>
            </div>

            <div className="ldd-faq__contact">
              <p>Need more information?</p>
              <Link className="ldd-faq__contact-link" href="/contact">
                Contact us
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div className="ldd-faq__accordion reveal" ref={accordionRef}>
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
                      <span>{item.question}</span>
                      <span className="ldd-faq__icon" aria-hidden="true" />
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
      </div>
    </section>
  );
}