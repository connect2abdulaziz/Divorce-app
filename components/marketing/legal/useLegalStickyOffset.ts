"use client";

import { useEffect } from "react";

export function useLegalStickyOffset() {
  useEffect(() => {
    const header = document.querySelector(".header");
    if (!header) return;

    const sync = () => {
      const height = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--ldd-legal-sticky-top", `${height + 16}px`);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(header);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);
}