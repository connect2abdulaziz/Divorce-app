export const DIALOG_MESSAGES = {
  start: {
    title: 'Continue your intake.',
    body: 'Create your account to start the secure online questionnaire. No payment is required to answer the initial questions.',
  },
  portal: {
    title: 'Client login',
    body: 'Sign in to continue your questionnaire where you left off.',
  },
  quote: {
    title: 'See which option fits your case',
    body: 'Based on your answers, we will recommend the package that matches your situation. Create an account to continue — package confirmation and payment happen after qualification.',
  },
};

export const NAV_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#arizona', label: 'Arizona Divorce' },
  { href: '#faq', label: 'FAQ' },
];

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

export const FOOTER_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#arizona', label: 'Arizona Divorce' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export const FOOTER_LEGAL = [
  { href: '#privacy', label: 'Privacy Policy' },
  { href: '#terms', label: 'Terms of Service' },
  { href: '#refund', label: 'Refund Policy' },
  { href: '#disclaimer', label: 'Disclaimer' },
];

export const HELP_OPTIONS = [
  {
    id: 'online',
    title: 'Prepare My Documents Online',
    body: 'Complete the questionnaire and receive prepared Arizona divorce documents.',
  },
  {
    id: 'guided',
    title: 'Help Me With the Document Process',
    body: 'Get personal assistance with document preparation and filing support.',
  },
];

/** Replace with your licensed CLDP details before launch. */
export const CLDP_INFO = {
  name: '[Certified Legal Document Preparer Name]',
  certification: 'Arizona Certified Legal Document Preparer #[Certification Number]',
};
