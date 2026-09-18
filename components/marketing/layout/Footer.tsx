"use client";
// @ts-nocheck

import { CLDP_INFO, FOOTER_LEGAL, FOOTER_LINKS } from '@/lib/marketing/content';
import { Brand } from '../ui/Brand';

export function Footer({ onSignIn }: { onSignIn: () => void }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-grid">
        <div className="footer-brand">
          <Brand loading="lazy" />
          <p className="footer-tagline">Arizona Divorce Document Preparation</p>
          <p className="footer-disclaimer">
            Legal Divorce Docs is not a law firm and does not provide legal advice or legal
            representation. Services are provided for self-represented individuals.
          </p>
          <p className="footer-cldp">
            {CLDP_INFO.name}
            <br />
            {CLDP_INFO.certification}
          </p>
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
