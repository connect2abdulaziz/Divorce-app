"use client";

import { useEffect } from "react";

export function usePageMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return undefined;

    let observer: IntersectionObserver | undefined;
    const observed = new WeakSet<Element>();

    const watch = (element: Element) => {
      if (observed.has(element)) return;
      observed.add(element);
      observer?.observe(element);
    };

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
      document.querySelectorAll(".reveal").forEach(watch);
    }

    // Pick up sections that mount after the first paint (Suspense, late client trees).
    const mutations = new MutationObserver(() => {
      document.querySelectorAll(".reveal").forEach(watch);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer?.disconnect();
      document.documentElement.classList.remove("motion");
    };
  }, []);
}
