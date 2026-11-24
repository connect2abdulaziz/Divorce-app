import { useEffect, useRef } from "react";

const SCROLL_LOCK_CLASS = "marketing-scroll-locked";

/**
 * Prevents background scrolling while overlays (modals, mobile nav) are open.
 * Preserves document scroll position (no body position:fixed).
 */
export function useScrollLock(locked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!locked) return;

    const { body, documentElement: html } = document;
    scrollYRef.current = window.scrollY;

    html.classList.add(SCROLL_LOCK_CLASS);
    body.classList.add(SCROLL_LOCK_CLASS);

    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlScrollBehavior: html.style.scrollBehavior,
    };

    html.style.scrollBehavior = "auto";
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const savedY = scrollYRef.current;
    const syncScroll = () => window.scrollTo(0, savedY);
    syncScroll();
    const raf = requestAnimationFrame(syncScroll);

    return () => {
      cancelAnimationFrame(raf);
      const restoreY = scrollYRef.current;

      html.classList.remove(SCROLL_LOCK_CLASS);
      body.classList.remove(SCROLL_LOCK_CLASS);
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      html.style.scrollBehavior = previous.htmlScrollBehavior;

      window.scrollTo(0, restoreY);
    };
  }, [locked]);
}