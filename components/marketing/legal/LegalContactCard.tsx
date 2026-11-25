import Link from "next/link";
import { Icon } from "@/components/marketing/ui/Icon";

export function LegalContactCard({ className = "" }: { className?: string }) {
  return (
    <aside className={`ldd-legal-contact ${className}`.trim()} aria-label="Contact assistance">
      <div className="ldd-legal-contact__icon" aria-hidden="true">
        <Icon name="message" size={18} />
      </div>
      <p className="ldd-legal-contact__title">Have a question?</p>
      <p className="ldd-legal-contact__text">Contact our team for assistance.</p>
      <Link href="/contact" className="ldd-legal-contact__link">
        Contact us →
      </Link>
    </aside>
  );
}