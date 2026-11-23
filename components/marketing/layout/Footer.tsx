"use client";
// @ts-nocheck

import { CLDP_INFO, FOOTER_LEGAL, FOOTER_LINKS } from '@/lib/marketing/content';
import { Brand } from '../ui/Brand';

export function Footer({ onSignIn }: { onSignIn: () => void }) {
  const year = new Date().getFullYear();
  const hasCldp = Boolean(CLDP_INFO.name || CLDP_INFO.certification);

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Brand loading="lazy" />
          <p className="footer-tagline">Arizona Divorce Document Preparation</p>
          <p className="footer-disclaimer">
            Legal Divorce Docs is not a law firm and does not provide legal advice or legal
            representation. Services are provided for self-represented individuals.
          </p>
          <p className="footer-contact-line">
            Questions?{" "}
            <a href="/contact">Contact us</a>
          </p>
          {hasCldp ? (
            <p className="footer-cldp">
              {CLDP_INFO.name ? (
                <>
                  {CLDP_INFO.name}
                  <br />
                </>
              ) : null}
              {CLDP_INFO.certification ||
                (CLDP_INFO.name ? 'Arizona Certified Legal Document Preparer' : null)}
            </p>
          ) : (
            <p className="footer-cldp">Arizona Certified Legal Document Preparer</p>
          )}
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          {FOOTER_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <button type="button" onClick={onSignIn}>
            Client Login
          </button>
        </div>

        <div className="footer-column">
          <h3>Policies</h3>
          {FOOTER_LEGAL.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Legal Divorce Docs. All rights reserved.</span>
        <a href="#main">Back to top</a>
      </div>
    </footer>
  );
}
