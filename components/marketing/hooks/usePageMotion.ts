"use client";

import { useEffect } from "react";

export function usePageMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return undefined;

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      document.documentElement.classList.add("motion");
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              entry.target.setAttribute("data-visible", "");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      document.querySelectorAll(".reveal").forEach((element) => observer?.observe(element));
    }

    return () => {
      observer?.disconnect();
      document.documentElement.classList.remove("motion");
    };
  }, []);
}
