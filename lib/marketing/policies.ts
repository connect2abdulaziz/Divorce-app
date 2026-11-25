export type PolicySlug = "privacy" | "terms" | "refund" | "disclaimer";

export type PolicyDoc = {
  slug: PolicySlug;
  title: string;
  summary: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const POLICY_NAV: {
  slug: PolicySlug;
  href: string;
  label: string;
  icon: "shield" | "document" | "refund" | "info";
}[] = [
  { slug: "privacy", href: "/privacy", label: "Privacy Policy", icon: "shield" },
  { slug: "terms", href: "/terms", label: "Terms of Service", icon: "document" },
  { slug: "refund", href: "/refund", label: "Refund Policy", icon: "refund" },
  { slug: "disclaimer", href: "/disclaimer", label: "Disclaimer", icon: "info" },
];

/** Stable anchor IDs for in-page navigation (derived from section headings). */
export function policySectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** First section id to show in a warm notice panel (existing copy only). */
export const POLICY_CALLOUT_SECTION_ID: Partial<Record<PolicySlug, string>> = {
  terms: policySectionId("Not a law firm"),
};

export const POLICY_DOCS: PolicyDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary:
      "How Legal Divorce Docs collects, uses, and protects personal information when you use our Arizona divorce document preparation service.",
    sections: [
      {
        heading: "Information we collect",
        paragraphs: [
          "We collect account details you provide at signup (such as name, email, and password) and the questionnaire answers you enter about your case, including contact information, identity fields, marriage details, children, property, debts, and related documents.",
          "We also collect limited technical information needed to operate the service, such as authentication session data and basic device/browser information.",
        ],
      },
      {
        heading: "How we use information",
        paragraphs: [
          "We use your information to create and secure your account, prepare Arizona divorce documents from your answers, provide customer support, process payments when applicable, and improve the reliability of the service.",
          "We do not sell your personal information. We do not use questionnaire answers for unrelated marketing.",
        ],
      },
      {
        heading: "Sharing and storage",
        paragraphs: [
          "We may share information with service providers that help us host the application, authenticate users, process payments, or send transactional email. Those providers may only use the information to perform services for us.",
          "Your information is stored with reasonable administrative and technical safeguards. No method of transmission or storage is completely secure.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You may request access to or correction of account information by contacting us. You may also request deletion subject to legal, accounting, or case-record retention requirements.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Questions about this Privacy Policy may be sent through the contact options listed on our website.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    summary:
      "The terms that govern use of Legal Divorce Docs, an Arizona legal document preparation service for self-represented individuals.",
    sections: [
      {
        heading: "Not a law firm",
        paragraphs: [
          "Legal Divorce Docs is not a law firm and does not provide legal advice, legal representation, or attorney-client services. An Arizona Certified Legal Document Preparer may prepare documents and provide general legal information, but cannot advise you on your legal rights or represent you in court.",
        ],
      },
      {
        heading: "Your responsibilities",
        paragraphs: [
          "You are responsible for providing accurate information, reviewing prepared documents before signing or filing, and deciding whether document preparation is appropriate for your situation. If you need legal advice, consult a licensed Arizona attorney.",
        ],
      },
      {
        heading: "Accounts and acceptable use",
        paragraphs: [
          "You must provide accurate account information and keep login credentials confidential. You may not misuse the service, attempt unauthorized access, or submit content you do not have the right to provide.",
        ],
      },
      {
        heading: "Service scope and changes",
        paragraphs: [
          "Package features and pricing are described on the Services and Pricing pages before purchase. We may update these Terms; the version posted on this page applies to continued use of the service.",
        ],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refund Policy",
    summary:
      "When refunds may be available for Legal Divorce Docs document preparation packages.",
    sections: [
      {
        heading: "Before document preparation begins",
        paragraphs: [
          "If you purchase a package and cancel before document preparation work has begun, you may request a full refund of the service fee paid to Legal Divorce Docs.",
        ],
      },
      {
        heading: "After work has started",
        paragraphs: [
          "Once questionnaire review or document preparation has started, refunds are generally not available except where required by law or where we determine a service defect prevented delivery of the purchased package.",
        ],
      },
      {
        heading: "What is not refundable",
        paragraphs: [
          "Court filing fees, process-server fees, and other third-party charges are separate from our service fee and are not refundable through Legal Divorce Docs.",
          "Change of mind after documents have been prepared, or a later decision to hire an attorney, does not by itself create a refund right.",
        ],
      },
      {
        heading: "How to request a refund",
        paragraphs: [
          "Contact us with your account email and purchase details. Eligible refunds are issued to the original payment method when reasonably possible.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    summary:
      "Important limits on Legal Divorce Docs services for Arizona divorce document preparation.",
    sections: [
      {
        heading: "Document preparation only",
        paragraphs: [
          "Legal Divorce Docs prepares Arizona divorce documents based on information you provide. We do not provide legal advice, strategy, or representation, and use of this website does not create an attorney-client relationship.",
        ],
      },
      {
        heading: "No guarantee of outcome",
        paragraphs: [
          "Court acceptance, timelines, and case outcomes depend on the facts of your case, court requirements, and actions you take after documents are prepared. We do not guarantee that a court will accept filings or grant any requested relief.",
        ],
      },
      {
        heading: "Accuracy of your information",
        paragraphs: [
          "Documents are only as accurate as the answers you provide. You are responsible for reviewing every document before signing or filing and for correcting any incomplete or inaccurate information.",
        ],
      },
      {
        heading: "When to seek an attorney",
        paragraphs: [
          "Complex cases — including contested custody, significant assets, domestic violence concerns, or uncertainty about your legal rights — may require advice from a licensed Arizona attorney.",
        ],
      },
    ],
  },
];

export function getPolicy(slug: PolicyDoc["slug"]) {
  return POLICY_DOCS.find((doc) => doc.slug === slug) ?? null;
}
