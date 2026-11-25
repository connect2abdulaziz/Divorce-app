"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/marketing/ui/Icon";
import {
  POLICY_NAV,
  policySectionId,
  type PolicyDoc,
} from "@/lib/marketing/policies";
import { LegalContactCard } from "./LegalContactCard";
import { useLegalStickyOffset } from "./useLegalStickyOffset";

export function LegalSidebar({ doc }: { doc: PolicyDoc }) {
  const pathname = usePathname();
  const sectionIds = useMemo(
    () => doc.sections.map((s) => policySectionId(s.heading)),
    [doc.sections]
  );
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useLegalStickyOffset();

  useEffect(() => {
    setActiveId(sectionIds[0] ?? "");
  }, [sectionIds]);

  useEffect(() => {
    if (typeof window === "undefined" || sectionIds.length === 0) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    observerRef.current?.disconnect();

    const stickyTop =
      getComputedStyle(document.documentElement).getPropertyValue("--ldd-legal-sticky-top").trim() ||
      "80px";

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target.id;
        if (id) setActiveId(id);
      },
      {
        root: null,
        rootMargin: `-${stickyTop} 0px -55% 0px`,
        threshold: prefersReducedMotion ? [0, 1] : [0, 0.2, 0.45, 0.7],
      }
    );

    for (const el of sections) observerRef.current.observe(el);

    return () => observerRef.current?.disconnect();
  }, [sectionIds]);

  return (
    <div className="ldd-legal__sidebar">
    <nav className="ldd-legal-nav" aria-label="Legal information">
      <p className="ldd-legal-nav__eyebrow">Legal information</p>
      <ul className="ldd-legal-nav__list">
        {POLICY_NAV.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`ldd-legal-nav__link${isCurrent ? " ldd-legal-nav__link--current" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                <Icon name={item.icon} size={18} className="ldd-legal-nav__icon" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>

    <div className="ldd-legal-toc__divider" role="presentation" />

    <nav className="ldd-legal-toc" aria-label="On this page">
      <p className="ldd-legal-toc__eyebrow">On this page</p>
      <ol className="ldd-legal-toc__list">
        {doc.sections.map((section) => {
          const id = policySectionId(section.heading);
          const isActive = activeId === id;
          return (
            <li key={section.heading}>
              <a
                href={`#${id}`}
                className={`ldd-legal-toc__link${isActive ? " ldd-legal-toc__link--active" : ""}`}
                aria-current={isActive ? "location" : undefined}
              >
                {section.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>

      <LegalContactCard className="ldd-legal-contact--sidebar" />
    </div>
  );
}