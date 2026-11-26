"use client";

import { FormEvent, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CONTACT_INFO } from "@/lib/marketing/content";
import { submitContactMessage } from "@/lib/contact/actions";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ServiceQualifyCta } from "@/components/marketing/service/ServiceQualifyCta";
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
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const hours = splitBusinessHours(CONTACT_INFO.hours);
  const startQualify = () => router.push("/#qualify");

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
      <div className="ldd-contact-page">
        <section className="ldd-contact-intro" aria-labelledby="contact-heading">
          <div className="ldd-contact-intro__inner">
            <div className="ldd-contact-intro__col ldd-contact-intro__col--main">
              <p className="ldd-contact-intro__eyebrow">CONTACT US</p>
              <h1 id="contact-heading" className="ldd-contact-intro__title">
                Questions about
                <span className="ldd-contact-intro__title-line">your divorce paperwork?</span>
              </h1>
              <p className="ldd-contact-intro__lead">We are here to help with the process.</p>
            </div>

            <div className="ldd-contact-intro__divider" role="presentation" aria-hidden="true" />

            <div className="ldd-contact-intro__col ldd-contact-intro__col--support">
              <p className="ldd-contact-intro__description">{CONTACT_INFO.blurb}</p>
              <p className="ldd-contact-intro__description ldd-contact-intro__description--muted">
                {DISCLAIMER}
              </p>
            </div>
          </div>
        </section>

        <section className="ldd-contact-main" aria-label="Contact options and message form">
          <div className="ldd-contact-main__outer">
            <div className="ldd-contact-main__panel">
              <aside className="ldd-contact-main__aside">
                <p className="ldd-contact-main__eyebrow">GET IN TOUCH</p>
                <h2 className="ldd-contact-main__aside-title">How can we help?</h2>
                <p className="ldd-contact-main__aside-lede">
                  Reach our team for questions about packages, your questionnaire, or the document
                  preparation process.
                </p>

                <ul className="ldd-contact-main__channels">
                  <li className="ldd-contact-main__channel">
                    <Icon name="mail" size={20} className="ldd-contact-main__channel-icon" />
                    <ChannelText
                      label="Email"
                      value={
                        <a href={`mailto:${CONTACT_INFO.email}`} className="ldd-contact-main__link">
                          {CONTACT_INFO.email}
                        </a>
                      }
                    />
                  </li>
                  {CONTACT_INFO.phone ? (
                    <li className="ldd-contact-main__channel">
                      <Icon name="message" size={20} className="ldd-contact-main__channel-icon" />
                      <ChannelText
                        label="Phone"
                        value={
                          <a href={`tel:${CONTACT_INFO.phone}`} className="ldd-contact-main__link">
                            {CONTACT_INFO.phone}
                          </a>
                        }
                      />
                    </li>
                  ) : null}
                  <li className="ldd-contact-main__channel">
                    <Icon name="clock" size={20} className="ldd-contact-main__channel-icon" />
                    <div className="ldd-contact-main__channel-text">
                      <span className="ldd-contact-main__channel-label">Business hours</span>
                      <span className="ldd-contact-main__channel-value">
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

                <hr className="ldd-contact-main__rule" aria-hidden="true" />

                <h3 className="ldd-contact-main__topics-title">We can assist you with</h3>
                <ul className="ldd-contact-main__topics">
                  {CONTACT_TOPICS.map((topic) => (
                    <li key={topic}>
                      <Icon name="check" size={18} className="ldd-contact-main__topics-check" aria-hidden="true" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="ldd-contact-main__divider" role="presentation" aria-hidden="true" />

              <div className="ldd-contact-main__form-wrap">
                {sent ? (
                  <div className="ldd-contact-main__form ldd-contact-main__form--success" role="status">
                    <span className="ldd-contact-main__success-icon" aria-hidden="true">
                      <Icon name="check" size={24} />
                    </span>
                    <h2 className="ldd-contact-main__form-title">Message sent</h2>
                    <p className="ldd-contact-main__form-lede">
                      Thanks — we received your message. Our team will review it and follow up by email during
                      business hours.
                    </p>
                    <PrimaryButton
                      type="button"
                      className="ldd-contact-main__submit"
                      onClick={() => setSent(false)}
                    >
                      Send another message
                    </PrimaryButton>
                  </div>
                ) : (
                  <form className="ldd-contact-main__form" onSubmit={handleSubmit} noValidate>
                    <h2 className="ldd-contact-main__form-title">Send us a message</h2>
                    <p className="ldd-contact-main__form-lede">
                      Include your name, the email we should reply to, and a short description of your
                      question.
                    </p>

                    <div className="ldd-contact-main__fields">
                      <p className="ldd-contact-main__field">
                        <label className="ldd-contact-main__label" htmlFor="contact-name">
                          Full name <span className="ldd-contact-main__required" aria-hidden="true">*</span>
                        </label>
                        <input
                          className="ldd-contact-main__input"
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
                      <p className="ldd-contact-main__field">
                        <label className="ldd-contact-main__label" htmlFor="contact-email">
                          Email address <span className="ldd-contact-main__required" aria-hidden="true">*</span>
                        </label>
                        <input
                          className="ldd-contact-main__input"
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
                      <p className="ldd-contact-main__field">
                        <label className="ldd-contact-main__label" htmlFor="contact-message">
                          Message <span className="ldd-contact-main__required" aria-hidden="true">*</span>
                        </label>
                        <textarea
                          className="ldd-contact-main__input ldd-contact-main__input--area"
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
                      <p className="ldd-contact-main__error" role="alert">
                        {error}
                      </p>
                    ) : null}

                    <PrimaryButton type="submit" className="ldd-contact-main__submit" disabled={pending}>
                      {pending ? "Sending…" : "Send message"}
                    </PrimaryButton>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <ServiceQualifyCta onStart={startQualify} />
      </div>
    </MarketingShell>
  );
}

function ChannelText({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="ldd-contact-main__channel-text">
      <span className="ldd-contact-main__channel-label">{label}</span>
      <div className="ldd-contact-main__channel-value">{value}</div>
    </div>
  );
}