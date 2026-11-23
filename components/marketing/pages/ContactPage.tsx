"use client";

import { FormEvent, useState, useTransition } from "react";
import { CONTACT_INFO } from "@/lib/marketing/content";
import { submitContactMessage } from "@/lib/contact/actions";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PrimaryButton } from "@/components/marketing/ui/PrimaryButton";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await submitContactMessage(formData);
      if (!result.ok) {
        setError(result.error);
        setSent(false);
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    });
  }

  return (
    <MarketingShell>
      <section className="contact-page" aria-labelledby="contact-heading">
        <div className="contact-page-inner">
          <header className="contact-hero">
            <p className="contact-brand">Legal Divorce Docs</p>
            <h1 id="contact-heading">Contact</h1>
            <p className="contact-lead">{CONTACT_INFO.blurb}</p>
            <a className="contact-email-link" href={`mailto:${CONTACT_INFO.email}`}>
              {CONTACT_INFO.email}
            </a>
            <p className="contact-meta">
              {CONTACT_INFO.hours}
              {CONTACT_INFO.phone ? (
                <>
                  <span aria-hidden="true"> · </span>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`}>{CONTACT_INFO.phone}</a>
                </>
              ) : null}
            </p>
          </header>

          {sent ? (
            <div className="contact-form-panel contact-success" role="status">
              <h2>Message sent</h2>
              <p>
                Thanks — your message was received. Our team will review it in the case dashboard and
                follow up by email.
              </p>
              <PrimaryButton
                className="cta-strong contact-submit"
                type="button"
                onClick={() => setSent(false)}
              >
                Send another message
              </PrimaryButton>
            </div>
          ) : (
            <form className="contact-form-panel" onSubmit={handleSubmit} noValidate>
              <div className="contact-form-row">
                <div>
                  <label className="field-label" htmlFor="contact-name">
                    Full name
                  </label>
                  <input
                    className="field-input"
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="contact-email">
                    Your email
                  </label>
                  <input
                    className="field-input"
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="field-label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  className="field-input contact-message"
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>

              {error ? <p className="contact-form-error">{error}</p> : null}

              <PrimaryButton className="cta-strong contact-submit" type="submit" disabled={pending}>
                {pending ? "Sending…" : "Send message"}
              </PrimaryButton>
            </form>
          )}

          <p className="contact-footnote">
            Document preparation only — we do not provide legal advice or court representation.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
