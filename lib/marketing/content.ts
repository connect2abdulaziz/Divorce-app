export const DIALOG_MESSAGES = {
  start: {
    title: 'Your recommended package',
    body: 'Based on your answers, here is the service that matches your preferences. Create an account to continue — payment is collected after you confirm the package in your account.',
  },
  portal: {
    title: 'Client login',
    body: 'Sign in to continue your questionnaire where you left off.',
  },
  quote: {
    title: 'Your recommended package',
    body: 'Based on your answers, here is the service that matches your preferences. Create an account to continue — payment is collected after you confirm the package in your account.',
  },
};

export const QUALIFY_STORAGE_KEY = 'ldd-qualify-answers';

export const SERVICE_ROUTES = {
  overview: '/services',
  diyOnline: '/services/diy-online',
  fullyGuided: '/services/fully-guided',
  /** Anchor on the combined services overview — still valid for in-page jumps. */
  fullyGuidedOverviewAnchor: '/services#service-guided',
} as const;

export const SERVICES_DROPDOWN_ITEMS = [
  {
    href: SERVICE_ROUTES.diyOnline,
    title: 'DIY Online Divorce',
    description: 'Prepare your Arizona divorce documents at your own pace.',
  },
  {
    href: SERVICE_ROUTES.fullyGuided,
    title: 'Fully Guided Divorce',
    description: 'Explore additional personal assistance with document preparation.',
  },
];

export const NAV_LINKS = [
  { href: '/about-us', label: 'About Us' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

export const COURT_FEES_NOTE = 'Court filing fees not included.';

export const WHY_CARDS = [
  {
    icon: 'pin',
    title: 'Arizona Focused',
    body: 'Our document preparation process is designed specifically for Arizona divorce cases.',
  },
  {
    icon: 'document',
    title: 'Simple Online Questionnaire',
    body: 'Answer questions about your marriage, children, property, debts and other information needed to prepare your documents.',
  },
  {
    icon: 'folder',
    title: 'Professional Document Preparation',
    body: 'Your information is used to prepare the Arizona divorce documents applicable to the service you select.',
  },
  {
    icon: 'users',
    title: 'Real Human Support',
    body: 'Need assistance completing the document preparation process? Help is available from an Arizona Certified Legal Document Preparer.',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    title: 'Tell us about your situation',
    body: 'Answer three introductory questions.',
  },
  {
    title: 'Choose your service',
    body: 'Explore the available document preparation options.',
  },
  {
    title: 'Complete your questionnaire',
    body: 'Provide the information required for your documents.',
  },
  {
    title: 'Review and submit',
    body: 'Check your information before submitting.',
  },
  {
    title: 'Receive your documents',
    body: 'Move forward with your prepared paperwork.',
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: '1',
    title: 'Tell Us About Your Situation',
    body: 'Complete our secure online questionnaire.',
  },
  {
    number: '2',
    title: 'Your Documents Are Prepared',
    body: 'Your information is used to prepare your Arizona divorce documents.',
  },
  {
    number: '3',
    title: 'Review & Sign',
    body: 'Review your documents and follow the provided signing instructions.',
  },
  {
    number: '4',
    title: 'File Your Documents',
    body: 'Depending on the package selected, file the documents yourself or receive filing assistance.',
  },
  {
    number: '5',
    title: 'Continue Through the Divorce Process',
    body: 'Follow the required Arizona court procedures and complete the remaining documents applicable to your case.',
  },
];

export const PRICING_PACKAGE_TAGLINES: Record<'diy' | 'guided', string> = {
  guided: 'More personal support.',
  diy: 'At your own pace.',
};

/** Homepage pricing display order (Fully Guided first). */
export const PRICING_PACKAGES_HOME_ORDER = ['guided', 'diy'] as const;

export const PRICING_PACKAGES = [
  {
    id: 'diy',
    name: 'DIY Online',
    price: '$450',
    blurb: 'Best for customers comfortable handling more of the process themselves.',
    popular: false,
    cta: 'Start Online — $450',
    features: [
      'Online divorce questionnaire',
      'Personalized Arizona divorce documents',
      'Secure client account',
      'Download your documents',
      'Document instructions',
      'Edit your information before documents are finalized',
    ],
  },
  {
    id: 'guided',
    name: 'Fully Guided',
    price: '$799',
    blurb: 'For customers who want more personal assistance with the document preparation and filing process.',
    popular: true,
    cta: 'Get Fully Guided — $799',
    features: [
      'Everything included in the online package',
      'Personal document preparation assistance',
      'Document review for completeness',
      'Filing assistance',
      'Step-by-step procedural information',
      'Assistance with additional documents included within the selected service',
    ],
  },
];

/** Map screener “help” answer to a priced package shown before signup. */
export function packageForHelp(help: string | null | undefined) {
  if (help === 'guided') {
    return PRICING_PACKAGES.find((pkg) => pkg.id === 'guided') ?? PRICING_PACKAGES[1];
  }
  return PRICING_PACKAGES.find((pkg) => pkg.id === 'diy') ?? PRICING_PACKAGES[0];
}

export const ARIZONA_POINTS = [
  { icon: 'document', label: 'Arizona Divorce Documents' },
  { icon: 'shield', label: 'Arizona Certified Legal Document Preparer' },
  { icon: 'users', label: 'With or Without Minor Children' },
  { icon: 'folder', label: 'Property & Debt Cases' },
];

export const COMPARISON_ROWS = [
  { feature: 'Upfront package pricing', us: true, attorney: 'Often varies' },
  { feature: 'Complete online', us: true, attorney: 'Varies' },
  { feature: 'Arizona-focused documents', us: true, attorney: true },
  { feature: 'Attorney representation', us: false, attorney: true },
  { feature: 'Legal advice', us: false, attorney: true },
  { feature: 'Starting service price', us: '$450', attorney: 'Varies' },
];

export const FAQ_ITEMS = [
  {
    question: 'Is Legal Divorce Docs a law firm?',
    answer:
      'No. Legal Divorce Docs provides legal document preparation services. We do not provide legal advice or represent customers in court.',
  },
  {
    question: 'Who prepares my divorce documents?',
    answer:
      'Your documents are prepared through our Arizona document preparation process based on the information you provide. Certified Legal Document Preparer information is displayed where applicable.',
  },
  {
    question: 'Can I use the service if I have children?',
    answer:
      'Yes. Our system supports qualifying Arizona divorce cases with and without minor children.',
  },
  {
    question: 'What if we have property or debts?',
    answer:
      'The questionnaire identifies property and debt information so the appropriate documents can be prepared based on the service purchased.',
  },
  {
    question: 'Are court filing fees included?',
    answer:
      'No, unless specifically stated otherwise. Court filing fees and other third-party charges are separate from our service fees.',
  },
  {
    question: 'Can you give me legal advice?',
    answer:
      'No. An Arizona Certified Legal Document Preparer can provide document preparation services and general legal information but cannot provide legal advice or represent you as an attorney.',
  },
  {
    question: 'Can you file the documents for me?',
    answer:
      'Filing assistance is available with qualifying service packages. The exact services included are clearly identified before purchase.',
  },
];

/** Simplified links shown in the marketing footer Explore column. */
export const FOOTER_EXPLORE_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/about-us', label: 'About Us' },
  { href: '/#pricing', label: 'Pricing' },
];

/** @deprecated Use FOOTER_EXPLORE_LINKS for the marketing footer. */
export const FOOTER_LINKS = FOOTER_EXPLORE_LINKS;

/** Public contact details. Override with NEXT_PUBLIC_CONTACT_EMAIL / PHONE. */
export const CONTACT_INFO = {
  email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'info@legaldivorcedocs.com').trim(),
  phone: (process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '').trim(),
  hours: 'Monday–Friday, 9:00 a.m.–5:00 p.m. Arizona time',
  blurb:
    'Questions about packages, your questionnaire, or document preparation? Send a message and we will get back to you.',
};

export const ABOUT_VALUES = [
  {
    title: 'Arizona focused',
    body: 'Our process is built for Arizona divorce document preparation — not a generic national form service.',
  },
  {
    title: 'Clear and upfront',
    body: 'You see what is included before you buy. Package pricing is straightforward, and court fees are called out separately.',
  },
  {
    title: 'Document preparation only',
    body: 'We prepare documents and share general procedural information. We are not a law firm and do not give legal advice.',
  },
  {
    title: 'Human support available',
    body: 'Need help finishing the paperwork path? Assistance is available from an Arizona Certified Legal Document Preparer.',
  },
];

export const SERVICE_DETAILS = [
  {
    id: 'diy',
    name: 'DIY Online Document Preparation',
    price: '$450',
    summary:
      'Complete a secure questionnaire online and receive personalized Arizona divorce documents with instructions for review, signing, and filing.',
    bestFor: 'Customers comfortable handling more of the process themselves.',
    includes: [
      'Online divorce questionnaire',
      'Personalized Arizona divorce documents',
      'Secure client account',
      'Downloadable documents and instructions',
      'Edits before documents are finalized',
    ],
  },
  {
    id: 'guided',
    name: 'Fully Guided Document Preparation',
    price: '$799',
    summary:
      'Everything in the online package, plus personal assistance with document preparation, completeness review, and filing support.',
    bestFor: 'Customers who want more hands-on help through the paperwork process.',
    includes: [
      'Everything in the DIY Online package',
      'Personal document preparation assistance',
      'Document review for completeness',
      'Filing assistance',
      'Step-by-step procedural information',
    ],
  },
];

export const FOOTER_LEGAL = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/refund', label: 'Refund Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
];

export const HELP_OPTIONS = [
  {
    id: 'online',
    title: 'Prepare My Documents Online',
    body: 'Complete our guided questionnaire and receive prepared Arizona divorce documents.',
  },
  {
    id: 'guided',
    title: 'Help Me With the Document Process',
    body: 'Get personal assistance with document preparation and filing support.',
  },
];

export const HOME_SERVICE_HIGHLIGHTS: Record<
  (typeof HELP_OPTIONS)[number]['id'],
  readonly string[]
> = {
  online: [
    'Guided online questionnaire',
    'Situation-specific documents',
    'Review your information',
  ],
  guided: [
    'Personal assistance',
    'Document preparation support',
    'Filing support',
  ],
};

export const HOME_SERVICE_LEARN_MORE: Record<(typeof HELP_OPTIONS)[number]['id'], string> = {
  online: SERVICE_ROUTES.diyOnline,
  guided: SERVICE_ROUTES.fullyGuided,
};

export type ServicePagePackageId = 'diy' | 'guided';

export type ServicePageIntroConfig = {
  eyebrow: string;
  headline: string;
  description: string;
  features: readonly string[];
  helpPreference: 'online' | 'guided';
};

export function getPricingPackage(id: 'diy' | 'guided') {
  return PRICING_PACKAGES.find((pkg) => pkg.id === id) ?? PRICING_PACKAGES[0];
}

export function getServiceDetail(id: 'diy' | 'guided') {
  return SERVICE_DETAILS.find((svc) => svc.id === id) ?? SERVICE_DETAILS[0];
}

/** Verified feature list for the DIY Online individual service page (intro column). */
export const DIY_SERVICE_INTRO_FEATURES = [
  'Guided online divorce questionnaire',
  'Personalized Arizona divorce documents',
  'Secure client account',
  'Save your progress and return later',
  'Download your prepared documents',
  'Review and edit your information before submission',
] as const;

export const SERVICE_PAGE_INTRO: Record<ServicePagePackageId, ServicePageIntroConfig> = {
  diy: {
    eyebrow: 'DIY ONLINE',
    headline: 'Divorce documents, at your own pace.',
    description:
      'For customers comfortable handling more of the divorce process themselves. Complete a guided online questionnaire and prepare personalized Arizona divorce documents based on your circumstances.',
    features: DIY_SERVICE_INTRO_FEATURES,
    helpPreference: 'online',
  },
  guided: {
    eyebrow: 'FULLY GUIDED',
    headline: 'More support.\nA clearer process.',
    description:
      'For customers who want more personal assistance with the document preparation and filing process.',
    features: PRICING_PACKAGES.find((p) => p.id === 'guided')!.features,
    helpPreference: 'guided',
  },
};

export const DIY_SERVICE_IDEAL_FOR = [
  'Are comfortable completing an online questionnaire independently.',
  'Prefer to handle more of the divorce process themselves.',
] as const;

export const DIY_SERVICE_BENEFITS = [
  {
    id: 'guided',
    icon: 'list' as const,
    title: 'GUIDED',
    body: 'Complete your information through a structured, step-by-step online questionnaire.',
  },
  {
    id: 'personalized',
    icon: 'document' as const,
    title: 'PERSONALIZED',
    body: 'Your Arizona divorce documents are generated using the information you provide.',
  },
  {
    id: 'flexible',
    icon: 'clock' as const,
    title: 'FLEXIBLE',
    body: 'Save your progress, return later and review your answers before submission.',
  },
  {
    id: 'accessible',
    icon: 'download' as const,
    title: 'ACCESSIBLE',
    body: 'Generate and download your prepared documents through your client account.',
  },
] as const;

export const DIY_SERVICE_PROCESS_STEPS = [
  {
    title: 'Find your package',
    body: 'Answer three introductory questions about your situation and the type of document preparation assistance you prefer.',
  },
  {
    title: 'Create your account',
    body: 'Create your client account, access your dashboard and begin a new divorce questionnaire.',
  },
  {
    title: 'Tell us about your situation',
    body: 'Complete the guided questionnaire with information about your marriage, children, property and debts, where applicable. You can save your progress and return later.',
  },
  {
    title: 'Review your information',
    body: 'Review your answers and make any necessary corrections before submitting your questionnaire.',
  },
  {
    title: 'Submit your questionnaire',
    body: 'Submit your completed information so the application can generate the appropriate Arizona divorce documents based on your answers.',
  },
  {
    title: 'Download your documents',
    body: 'Generate and download your available Arizona divorce document packet through your client account.',
  },
] as const;

export const DIY_SERVICE_CIRCUMSTANCES = [
  {
    title: 'Divorce with children',
    body: 'Relevant questionnaire sections address children, parenting arrangements and child-related information where applicable.',
  },
  {
    title: 'Divorce without children',
    body: 'A document preparation track is available for divorce cases without common minor children.',
  },
  {
    title: 'Property and debt',
    body: 'Conditional questionnaire sections collect information about property, assets and debts based on your circumstances.',
  },
  {
    title: 'Personalized documents',
    body: 'The application generates Arizona divorce documents using the information submitted through the questionnaire.',
  },
] as const;

export type ServiceFaqItem = {
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

export const DIY_SERVICE_FAQ_ITEMS: ServiceFaqItem[] = [
  {
    question: 'What is included in DIY Online?',
    answer:
      'DIY Online includes access to a guided divorce questionnaire, a client account and personalized Arizona divorce document preparation based on your answers. You can save your progress, review your information before submission and download your available documents.',
  },
  {
    question: 'Can I use DIY Online if I have children?',
    answer:
      'The questionnaire includes conditional sections for divorce situations involving common minor children, including relevant parenting and child-related information. The applicable document track depends on the answers you provide.',
  },
  {
    question: 'Can I save my progress and return later?',
    answer: 'Yes. You can save your questionnaire progress and return to your account to continue completing your information.',
  },
  {
    question: 'Can I edit my information before submitting?',
    answer: 'Yes. You can review and edit your questionnaire answers before final submission.',
  },
  {
    question: 'Are court filing fees included?',
    answer: 'No. Court filing fees are separate from the DIY Online service price.',
  },
  {
    question: 'How do I receive my divorce documents?',
    answer:
      'After completing and submitting your questionnaire, you can generate and download your available Arizona divorce document packet through your client account.',
  },
  {
    question: 'What if I need additional assistance?',
    answer:
      'If you would prefer additional personal assistance with document preparation, you can explore the',
    link: { href: SERVICE_ROUTES.fullyGuided, label: 'Fully Guided service option' },
  },
  {
    question: 'Does Legal Divorce Docs provide legal advice?',
    answer:
      'Legal Divorce Docs is a legal document preparation service and is not a law firm. We do not provide legal advice or legal representation.',
  },
];

export const GUIDED_SERVICE_IDEAL_FOR = [
  'Prefer additional personal assistance with preparing their divorce documents.',
  'Would like more support understanding the document preparation and filing process.',
] as const;

export const GUIDED_SERVICE_BENEFITS = [
  {
    id: 'personalized',
    icon: 'document' as const,
    title: 'PERSONALIZED',
    body: 'Your Arizona divorce documents are prepared using the information you provide through our guided questionnaire.',
  },
  {
    id: 'flexible',
    icon: 'clock' as const,
    title: 'FLEXIBLE',
    body: 'Complete your information through a structured online process, save your progress and review your answers before submission.',
  },
  {
    id: 'supported',
    icon: 'message' as const,
    title: 'SUPPORTED',
    body: 'The Fully Guided package is designed for customers who prefer additional personal document preparation assistance.',
  },
  {
    id: 'procedural',
    icon: 'list' as const,
    title: 'PROCEDURAL SUPPORT',
    body: 'Explore a service option that includes assistance with the document preparation and filing process, as described in our existing service offering.',
  },
] as const;

export const GUIDED_SERVICE_PROCESS_STEPS = [
  {
    title: 'Find your package',
    body: 'Answer three introductory questions about your situation and select the Fully Guided option if you prefer additional document preparation assistance.',
  },
  {
    title: 'Create your account',
    body: 'Create your client account, access your dashboard and begin a new divorce questionnaire.',
  },
  {
    title: 'Tell us about your situation',
    body: 'Complete the guided questionnaire with information about your marriage, children, property and debts, where applicable. Save your progress and return later if needed.',
  },
  {
    title: 'Review your information',
    body: 'Review your questionnaire answers and make any necessary corrections before submitting.',
  },
  {
    title: 'Submit your questionnaire',
    body: 'Submit your completed information so the appropriate Arizona divorce documents can be generated based on your answers.',
  },
  {
    title: 'Access your documents',
    body: 'Access the available Arizona divorce document packet through your client account.',
  },
] as const;

export const GUIDED_SERVICE_PROCESS_FOOTNOTE =
  'Fully Guided is designed for customers who prefer additional personal assistance with document preparation and filing-related procedures.';

export const GUIDED_SERVICE_CIRCUMSTANCES = [
  {
    title: 'Divorce with children',
    body: 'Relevant questionnaire sections collect information about children, parenting arrangements and child-related circumstances where applicable.',
  },
  {
    title: 'Divorce without children',
    body: 'A document preparation track is available for divorce cases without common minor children.',
  },
  {
    title: 'Property and debt',
    body: 'Conditional questionnaire sections collect information about property, assets and debts based on your circumstances.',
  },
  {
    title: 'Personalized documents',
    body: 'Arizona divorce documents are generated using the information submitted through the questionnaire.',
  },
] as const;

export const GUIDED_SERVICE_CIRCUMSTANCES_HEADING = {
  line1: 'Every divorce is different.',
  line2: 'The support you need may be different, too.',
} as const;

export const GUIDED_SERVICE_CIRCUMSTANCES_LEDE =
  'Our guided questionnaire adapts to the information you provide, helping prepare Arizona divorce documents that reflect your circumstances.';

export const GUIDED_SERVICE_FAQ_ITEMS: ServiceFaqItem[] = [
  {
    question: 'What is included in Fully Guided?',
    answer:
      'Fully Guided includes the features of our DIY Online service, with additional personal document preparation assistance and filing-related support as described in our service offering.',
  },
  {
    question: 'How is Fully Guided different from DIY Online?',
    answer:
      'DIY Online is designed for customers comfortable handling more of the document preparation process themselves. Fully Guided is designed for customers who prefer additional personal assistance with document preparation and filing-related procedures.',
  },
  {
    question: 'Do I still need to complete an online questionnaire?',
    answer:
      'Yes. The application uses a guided online questionnaire to collect the information needed to prepare your Arizona divorce documents.',
  },
  {
    question: 'Can I use Fully Guided if I have children?',
    answer:
      'The questionnaire includes conditional sections for divorce situations involving common minor children, including relevant parenting and child-related information. The applicable document track depends on the information you provide.',
  },
  {
    question: 'Can I save my progress and edit my information?',
    answer:
      'Yes. You can save your questionnaire progress, return to your account and review or edit your information before final submission.',
  },
  {
    question: 'Are court filing fees included?',
    answer: 'No. Court filing fees are separate from the Fully Guided service price.',
  },
  {
    question: 'How do I receive my divorce documents?',
    answer:
      'After completing and submitting your questionnaire, you can access and download your available Arizona divorce document packet through your client account.',
  },
  {
    question: 'Does Fully Guided include legal advice or legal representation?',
    answer:
      'No. Legal Divorce Docs is a legal document preparation service and is not a law firm. We do not provide legal advice or legal representation.',
  },
  {
    question: 'What if I prefer to handle more of the process myself?',
    answer:
      'Our DIY Online package is designed for customers who are comfortable completing their questionnaire and handling more of the divorce process independently. Explore our',
    link: { href: SERVICE_ROUTES.diyOnline, label: 'DIY Online service' },
  },
];

export type MarketingTestimonial = {
  id: string;
  quote: string;
  name: string;
  attribution?: string;
  isPlaceholder: boolean;
};

/** Approved customer testimonials — add entries here when ready for production. */
export const CUSTOMER_TESTIMONIALS: MarketingTestimonial[] = [];

/** Illustrative copy for local design preview only (isPlaceholder: true). */
export const SAMPLE_TESTIMONIALS: MarketingTestimonial[] = [
  {
    id: 'sample-01',
    quote:
      'The process felt much more manageable when everything was organized into clear steps.',
    name: 'Daniel M.',
    attribution: 'Arizona customer',
    isPlaceholder: true,
  },
  {
    id: 'sample-02',
    quote:
      'I appreciated having everything organized in one place rather than trying to figure out the paperwork on my own.',
    name: 'Rachel K.',
    attribution: 'Arizona customer',
    isPlaceholder: true,
  },
  {
    id: 'sample-03',
    quote: 'I liked knowing what the service included before getting started.',
    name: 'James T.',
    attribution: 'Arizona customer',
    isPlaceholder: true,
  },
];

/**
 * Public CLDP disclosure. Set NEXT_PUBLIC_CLDP_NAME and NEXT_PUBLIC_CLDP_NUMBER
 * in the environment so the footer never shows bracket placeholders.
 */
const CLDP_NAME = (process.env.NEXT_PUBLIC_CLDP_NAME ?? '').trim();
const CLDP_NUMBER = (process.env.NEXT_PUBLIC_CLDP_NUMBER ?? '').trim();

export const CLDP_INFO = {
  name: CLDP_NAME,
  number: CLDP_NUMBER,
  certification: CLDP_NUMBER
    ? `Arizona Certified Legal Document Preparer #${CLDP_NUMBER}`
    : '',
};
