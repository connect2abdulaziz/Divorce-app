"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CUSTOMER_TESTIMONIALS,
  SAMPLE_TESTIMONIALS,
  type MarketingTestimonial,
} from "@/lib/marketing/content";
import { Icon } from "../ui/Icon";

function resolveTestimonials(): MarketingTestimonial[] {
  const approved = CUSTOMER_TESTIMONIALS.filter((t) => !t.isPlaceholder);
  if (approved.length > 0) {
    return approved;
  }
  return SAMPLE_TESTIMONIALS;
}

function attributionLine(testimonial: MarketingTestimonial): string | null {
  if (!testimonial.attribution) return null;
  if (/illustrative|design preview|sample content/i.test(testimonial.attribution)) {
    return "Arizona customer";
  }
  return testimonial.attribution;
}

export function ReviewsSection() {
  const testimonials = useMemo(() => resolveTestimonials(), []);
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonialCount = testimonials.length;

  const handlePrevious = useCallback(() => {
    if (testimonialCount <= 1) return;
    setActiveIndex((current) => (current - 1 + testimonialCount) % testimonialCount);
  }, [testimonialCount]);

  const handleNext = useCallback(() => {
    if (testimonialCount <= 1) return;
    setActiveIndex((current) => (current + 1) % testimonialCount);
  }, [testimonialCount]);

  if (testimonialCount === 0) {
    return null;
  }

  return (
    <section
      className="ldd-testimonials"
      id="reviews"
      aria-labelledby="testimonials-label"
    >
      <div className="ldd-testimonials__inner">
        <p id="testimonials-label" className="ldd-testimonials__eyebrow">
          Customer experiences
        </p>

        <span className="ldd-testimonials__quote-mark" aria-hidden="true">
          &ldquo;
        </span>

        <div className="ldd-testimonials__slides" aria-live="polite" aria-atomic="true">
          {testimonials.map((testimonial, index) => {
            const isActive = index === activeIndex;
            const descriptor = attributionLine(testimonial);

            return (
              <figure
                key={testimonial.id}
                className={[
                  "ldd-testimonials__slide",
                  isActive ? "ldd-testimonials__slide--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden={!isActive}
              >
                <blockquote className="ldd-testimonials__quote">{testimonial.quote}</blockquote>
                <hr className="ldd-testimonials__rule" aria-hidden="true" />
                <figcaption className="ldd-testimonials__attribution">
                  <strong>{testimonial.name}</strong>
                  {descriptor ? <span>{descriptor}</span> : null}
                </figcaption>
              </figure>
            );
          })}
        </div>

        {testimonialCount > 1 ? (
          <div className="ldd-testimonials__nav">
            <button
              type="button"
              className="ldd-testimonials__nav-button"
              aria-label="Previous testimonial"
              onClick={handlePrevious}
            >
              <Icon
                name="chevronDown"
                size={18}
                className="ldd-testimonials__nav-icon ldd-testimonials__nav-icon--prev"
              />
            </button>
            <span className="ldd-testimonials__counter" aria-hidden="true">
              {String(activeIndex + 1).padStart(2, "0")}
              {" / "}
              {String(testimonialCount).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="ldd-testimonials__nav-button"
              aria-label="Next testimonial"
              onClick={handleNext}
            >
              <Icon
                name="chevronDown"
                size={18}
                className="ldd-testimonials__nav-icon ldd-testimonials__nav-icon--next"
              />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}