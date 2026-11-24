"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CUSTOMER_TESTIMONIALS,
  SAMPLE_TESTIMONIALS,
  type MarketingTestimonial,
} from "@/lib/marketing/content";
import { Icon } from "../ui/Icon";

function resolveTestimonials(): {
  list: MarketingTestimonial[];
  usingSamples: boolean;
} {
  const approved = CUSTOMER_TESTIMONIALS.filter((t) => !t.isPlaceholder);
  if (approved.length > 0) {
    return { list: approved, usingSamples: false };
  }
  if (process.env.NODE_ENV === "development" && SAMPLE_TESTIMONIALS.length > 0) {
    return { list: SAMPLE_TESTIMONIALS, usingSamples: true };
  }
  return { list: [], usingSamples: false };
}

export function ReviewsSection() {
  const { list: testimonials, usingSamples } = useMemo(() => resolveTestimonials(), []);
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonialCount = testimonials.length;
  const activeTestimonial = testimonials[activeIndex] ?? testimonials[0];

  const handlePrevious = useCallback(() => {
    if (testimonialCount <= 1) return;
    setActiveIndex((current) => (current - 1 + testimonialCount) % testimonialCount);
  }, [testimonialCount]);

  const handleNext = useCallback(() => {
    if (testimonialCount <= 1) return;
    setActiveIndex((current) => (current + 1) % testimonialCount);
  }, [testimonialCount]);

  if (testimonialCount === 0 || !activeTestimonial) {
    return null;
  }

  const introDescription = usingSamples
    ? "The quotes below are sample content for design preview. Verified customer feedback will replace them when available."
    : "Hear from customers about their experience navigating Arizona divorce paperwork.";

  return (
    <section className="ldd-testimonials" id="reviews" aria-labelledby="testimonials-heading">
      <div className="ldd-testimonials__inner">
        <div className="ldd-testimonials__layout">
          <div className="ldd-testimonials__intro reveal">
            <p className="ldd-testimonials__eyebrow">Customer experiences</p>
            <h2 id="testimonials-heading" className="ldd-testimonials__heading">
              <span>Every journey is different.</span>
              <em>Every story matters.</em>
            </h2>
            <p className="ldd-testimonials__description">{introDescription}</p>
          </div>

          {testimonialCount > 1 ? (
            <div className="ldd-testimonials__controls-wrap reveal">
              <div className="ldd-testimonials__controls">
                <button
                  type="button"
                  className="ldd-testimonials__nav-button ldd-testimonials__nav-button--previous"
                  aria-label="Previous testimonial"
                  onClick={handlePrevious}
                >
                  <Icon name="chevronDown" size={20} className="ldd-testimonials__nav-icon ldd-testimonials__nav-icon--prev" />
                </button>
                <button
                  type="button"
                  className="ldd-testimonials__nav-button ldd-testimonials__nav-button--next"
                  aria-label="Next testimonial"
                  onClick={handleNext}
                >
                  <Icon name="chevronDown" size={20} className="ldd-testimonials__nav-icon ldd-testimonials__nav-icon--next" />
                </button>
              </div>
            </div>
          ) : null}

          <div className="ldd-testimonials__featured reveal">
            <div className="ldd-testimonials__panel" aria-live="polite" aria-atomic="true">
              <span className="ldd-testimonials__quote-mark" aria-hidden="true">
                &ldquo;
              </span>

              <div className="ldd-testimonials__quotes-stack">
                {testimonials.map((testimonial, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <figure
                      key={testimonial.id}
                      className={
                        isActive
                          ? "ldd-testimonials__figure ldd-testimonials__figure--active ldd-testimonials__content-enter"
                          : "ldd-testimonials__figure ldd-testimonials__figure--inactive"
                      }
                      aria-hidden={!isActive}
                    >
                      <blockquote className="ldd-testimonials__quote">{testimonial.quote}</blockquote>
                      <figcaption className="ldd-testimonials__attribution">
                        <strong>{testimonial.name}</strong>
                        {testimonial.attribution ? <span>{testimonial.attribution}</span> : null}
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>

            {testimonialCount > 1 ? (
              <div className="ldd-testimonials__progress">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    type="button"
                    className="ldd-testimonials__indicator"
                    aria-label={`Show testimonial ${index + 1}`}
                    aria-current={activeIndex === index}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
                <span className="ldd-testimonials__counter" aria-hidden="true">
                  {String(activeIndex + 1).padStart(2, "0")}
                  {" / "}
                  {String(testimonialCount).padStart(2, "0")}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}