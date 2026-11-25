"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Icon } from "@/components/marketing/ui/Icon";
import { POLICY_NAV, policySectionId, type PolicyDoc } from "@/lib/marketing/policies";

export function LegalMobileNav({ doc }: { doc: PolicyDoc }) {
  const pathname = usePathname();
  const router = useRouter();
  const [tocOpen, setTocOpen] = useState(false);
  const selectId = useId();
  const tocId = useId();

  const current = POLICY_NAV.find((item) => item.href === pathname);

  return (
    <div className="ldd-legal-mobile">
      <h2 className="sr-only">Legal page navigation</h2>

      <div className="ldd-legal-mobile__control">
        <label htmlFor={selectId} className="ldd-legal-mobile__label">
          Policy
        </label>
        <div className="ldd-legal-mobile__select-wrap">
          {current ? <Icon name={current.icon} size={18} className="ldd-legal-mobile__select-icon" /> : null}
          <select
            id={selectId}
            className="ldd-legal-mobile__select"
            value={pathname}
            onChange={(e) => router.push(e.target.value)}
          >
            {POLICY_NAV.map((item) => (
              <option key={item.href} value={item.href}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <details
        className="ldd-legal-mobile__toc"
        open={tocOpen}
        onToggle={(e) => setTocOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="ldd-legal-mobile__toc-summary">
          <span>On this page</span>
          <Icon name={tocOpen ? "chevronUp" : "chevronDown"} size={18} />
        </summary>
        <ol id={tocId} className="ldd-legal-mobile__toc-list">
          {doc.sections.map((section) => {
            const id = policySectionId(section.heading);
            return (
              <li key={section.heading}>
                <Link href={`#${id}`} className="ldd-legal-mobile__toc-link">
                  {section.heading}
                </Link>
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}