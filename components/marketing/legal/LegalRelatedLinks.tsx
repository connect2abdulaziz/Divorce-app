import Link from "next/link";
import { POLICY_NAV, type PolicySlug } from "@/lib/marketing/policies";

export function LegalRelatedLinks({ currentSlug }: { currentSlug: PolicySlug }) {
  return (
    <nav className="ldd-legal-doc__related" aria-label="Related policies">
      <ul className="ldd-legal-doc__related-list">
        {POLICY_NAV.map((item) => {
          const isCurrent = item.slug === currentSlug;
          return (
            <li key={item.href} className="ldd-legal-doc__related-item">
              {isCurrent ? (
                <span className="ldd-legal-doc__related-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="ldd-legal-doc__related-link">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}