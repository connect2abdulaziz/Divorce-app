"use client";

import { FormEvent, useState, useTransition, type ReactNode } from "react";
import { CONTACT_INFO } from "@/lib/marketing/content";
import { submitContactMessage } from "@/lib/contact/actions";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Icon } from "@/components/marketing/ui/Icon";
import { PrimaryButton } from "@/components/marketing/ui/PrimaryButton";

const CONTACT_TOPICS = [
  "Package pricing and what is included",
  "Help with your client account or questionnaire",
  "Timeline, filing steps, or document delivery",
  "Technical issues signing in or saving answers",
] as const;

const DISCLAIMER =
  "Document preparation only — we do not provide legal advice or court representation.";

function splitBusinessHours(hours: string) {
  const comma = hours.indexOf(",");
  if (comma === -1) return { days: hours, times: null as string | null };
  return {
    days: hours.slice(0, comma).trim(),
    times: hours.slice(comma + 1).trim(),
  };
}

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const hours = splitBusinessHours(CONTACT_INFO.hours);

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
      <section className="ldd-contact-hero" aria-labelledby="contact-heading">
        <div className="ldd-contact-hero__inner">
          <div className="ldd-contact-hero__canvas reveal">
            <div className="ldd-contact-hero__grid">
              <div className="ldd-contact-hero__heading">
                <p className="ldd-contact-hero__eyebrow">Contact us</p>
                <h1 id="contact-heading">
                  Questions about <em>your divorce paperwork?</em>
                </h1>
              </div>
              <div className="ldd-contact-hero__support">
                <p className="ldd-contact-hero__support-lead">We are here to help with the process.</p>
                <p className="ldd-contact-hero__description">{CONTACT_INFO.blurb}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ldd-contact-block" aria-label="Contact options and message form">
        <div className="ldd-contact-block__inner">
          <div className="ldd-contact-block__shell reveal">
            <aside className="ldd-contact-block__info">
              <div className="ldd-contact-block__info-body">
                <header className="ldd-contact-block__info-head">
                  <p className="ldd-contact-block__eyebrow">Get in touch</p>
                  <h2 className="ldd-contact-block__info-title">How can we help?</h2>
                  <p className="ldd-contact-block__info-lede">
                    Reach our team for questions about packages, your questionnaire, or the document
                    preparation process.
                  </p>
                </header>

                <ul className="ldd-contact-block__channels">
                  <li className="ldd-contact-block__channel">
                    <span className="ldd-contact-block__icon-well" aria-hidden="true">
                      <Icon name="mail" size={20} />
                    </span>
                    <ChannelText
                      label="Email"
                      value={
                        <a href={`mailto:${CONTACT_INFO.email}`} className="ldd-contact-block__link">
                          {CONTACT_INFO.email}
                        </a>
                      }
                    />
                  </li>
                  <li className="ldd-contact-block__channel">
                    <span className="ldd-contact-block__icon-well" aria-hidden="true">
                      <Icon name="clock" size={20} />
                    </span>
                    <div className="ldd-contact-block__channel-text">
                      <span className="ldd-contact-block__channel-label">Business hours</span>
                      <span className="ldd-contact-block__channel-value">
                        {hours.days}
                        {hours.times ? (
                          <>
                            <br />
                            {hours.times}
                          </>
                        ) : null}
                      </span>
                    </div>
                  </li>
                </ul>

                <motionDivider />

                <div className="ldd-contact-block__assist">
                  <h3 className="ldd-contact-block__assist-title">We can assist you with</h3>
                  <ul className="ldd-contact-block__assist-list">
                    {CONTACT_TOPICS.map((topic) => (
                      <li key={topic}>
                        <Icon name="check" size={16} className="ldd-contact-block__assist-check" aria-hidden="true" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="ldd-contact-block__disclaimer">{DISCLAIMER}</p>
            </aside>

            <div className="ldd-contact-block__form-panel">
              {sent ? (
                <div className="ldd-contact-block__form ldd-contact-block__form--success" role="status">
                  <span className="ldd-contact-block__success-icon" aria-hidden="true">
                    <Icon name="check" size={28} />
                  </span>
                  <h2 className="ldd-contact-block__form-title">Message sent</h2>
                  <p className="ldd-contact-block__form-lede">
                    Thanks — we received your message. Our team will review it and follow up by email
                    during business hours.
                  </p>
                  <PrimaryButton
                    type="button"
                    className="ldd-contact-block__submit marketing-cta-primary"
                    icon="send"
                    onClick={() => setSent(false)}
                  >
                    Send another message
                  </PrimaryButton>
                </div>
              ) : (
                <form className="ldd-contact-block__form" onSubmit={handleSubmit} noValidate>
                  <header className="ldd-contact-block__form-head">
                    <h2 className="ldd-contact-block__form-title">Send us a message</h2>
                    <p className="ldd-contact-block__form-lede">
                      Include your name, the email we should reply to, and a short description of your
                      question.
                    </p>
                  </header>

                  <div className="ldd-contact-block__fields">
                    <p className="ldd-contact-block__field">
                      <label className="ldd-contact-block__label" htmlFor="contact-name">
                        Full name <span className="ldd-contact-block__required" aria-hidden="true">*</span>
                      </label>
                      <input
                        className="ldd-contact-block__input"
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </p>
                    <p className="ldd-contact-block__field">
                      <label className="ldd-contact-block__label" htmlFor="contact-email">
                        Email address <span className="ldd-contact-block__required" aria-hidden="true">*</span>
                      </label>
                      <input
                        className="ldd-contact-block__input"
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </p>
                    <p className="ldd-contact-block__field">
                      <label className="ldd-contact-block__label" htmlFor="contact-message">
                        Message <span className="ldd-contact-block__required" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        className="ldd-contact-block__input ldd-contact-block__input--area"
                        id="contact-message"
                        name="message"
                        rows={5}
                        required
                        placeholder="How can we help you?"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                      />
                    </p>
                  </div>

                  {error ? (
                    <p className="ldd-contact-block__error" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <PrimaryButton
                    type="submit"
                    className="ldd-contact-block__submit marketing-cta-primary"
                    icon="send"
                    disabled={pending}
                  >
                    {pending ? "Sending…" : "Send message"}
                  </PrimaryButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function MotionDivider() {
  return <hr className="ldd-contact-block__divider" aria-hidden="true" />;
}

function ChannelText({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="ldd-contact-block__channel-text">
      <span className="ldd-contact-block__channel-label">{label}</span>
      <div className="ldd-contact-block__channel-value">{value}</div>
    </div>
  );
}