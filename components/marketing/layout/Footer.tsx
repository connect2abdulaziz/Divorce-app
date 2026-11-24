"use client";

import Link from "next/link";
import { CLDP_INFO, FOOTER_EXPLORE_LINKS, FOOTER_LEGAL } from "@/lib/marketing/content";
import { useMarketingSession } from "@/components/marketing/hooks/useMarketingSession";
import { Brand } from "../ui/Brand";

export function Footer({ onSignIn }: { onSignIn: () => void }) {
  const { isAuthed, ready } = useMarketingSession();
  const year = new Date().getFullYear();
  const hasCldp = Boolean(CLDP_INFO.name || CLDP_INFO.certification);

  return (
    <footer className="ldd-footer">
      <div className="ldd-footer__inner">
        <div className="ldd-footer__main">
          <div className="ldd-footer__brand">
            <div className="ldd-footer__logo">
              <Brand loading="lazy" className="ldd-footer__brand-mark" />
            </div>

            <p className="ldd-footer__brand-heading">
              Arizona Divorce <em>Document Preparation.</em>
            </p>

            <p className="ldd-footer__disclaimer">
              Legal Divorce Docs is not a law firm and does not provide legal advice or legal
              representation. Services are provided for self-represented individuals.
            </p>

            {hasCldp ? (
              <p className="ldd-footer__certification">
                {CLDP_INFO.name ? (
                  <>
                    {CLDP_INFO.name}
                    <br />
                  </>
                ) : null}
                {CLDP_INFO.certification ||
                  (CLDP_INFO.name ? "Arizona Certified Legal Document Preparer" : null)}
              </p>
            ) : (
              <p className="ldd-footer__certification">Arizona Certified Legal Document Preparer</p>
            )}

            <div className="ldd-footer__contact">
              <Link className="ldd-footer__contact-link" href="/contact">
                Contact us
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <nav className="ldd-footer__nav" aria-label="Footer navigation">
            <p className="ldd-footer__nav-heading">Explore</p>
            <ul className="ldd-footer__links">
              {FOOTER_EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li>
                {ready && isAuthed ? (
                  <Link href="/dashboard">Dashboard</Link>
                ) : (
                  <button type="button" onClick={onSignIn}>
                    Client Login
                  </button>
                )}
              </li>
            </ul>
          </nav>

          <nav className="ldd-footer__nav" aria-label="Legal policies">
            <p className="ldd-footer__nav-heading">Legal</p>
            <ul className="ldd-footer__links">
              {FOOTER_LEGAL.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="ldd-footer__bottom">
          <p className="ldd-footer__copyright">
            © {year} Legal Divorce Docs. All rights reserved.
          </p>
          <a className="ldd-footer__back-to-top" href="#main">
            Back to top
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}