/**
 * AcroForm template catalog for Divorce WOC / Divorce WC packs.
 */

export type CaseTrack = "with_children" | "without_children";
export type DecreePath = "default_decree" | "consent_decree" | "summary_consent";
export type PackStep = "filing" | "service" | "default" | "decree" | "response";

export type DocumentTemplate = {
  id: string;
  formCode: string | null;
  title: string;
  track: CaseTrack;
  step: PackStep;
  decreePaths?: DecreePath[];
  optional?: boolean;
  /** Path relative to Divorce WOC / Divorce WC root. */
  relativePath: string;
};

const WOC: DocumentTemplate[] = [
  {
    id: "woc-filing-coversheet",
    formCode: "DRSDS10F-ANNZ",
    title: "Family Department Sensitive Data Cover Sheet",
    track: "without_children",
    step: "filing",
    relativePath:
      "1 Petition Divorce WO 1st step/Family Department Sensitive Data Cover Sheet  drsds10f-annz.pdf",
  },
  {
    id: "woc-filing-petition",
    formCode: "DRDA10FZ",
    title: "Petition for Dissolution (Without Minor Children)",
    track: "without_children",
    step: "filing",
    relativePath:
      "1 Petition Divorce WO 1st step/Petition for Dissolution of Non-Covenant Marriage without Minor Children  drda10fz.pdf",
  },
  {
    id: "woc-filing-summons",
    formCode: "DR11FZ",
    title: "Summons",
    track: "without_children",
    step: "filing",
    relativePath: "1 Petition Divorce WO 1st step/Summons dr11fz.pdf",
  },
  {
    id: "woc-filing-injunction",
    formCode: "DR14FZ",
    title: "Preliminary Injunction",
    track: "without_children",
    step: "filing",
    relativePath: "1 Petition Divorce WO 1st step/Preliminary Injunction dr14fz.pdf",
  },
  {
    id: "woc-filing-creditors",
    formCode: "DR16FZ",
    title: "Notice Regarding Creditors",
    track: "without_children",
    step: "filing",
    relativePath: "1 Petition Divorce WO 1st step/Notice Regarding Creditors dr16fz.pdf",
  },
  {
    id: "woc-filing-insurance",
    formCode: "DRD16FZ",
    title: "Notice Regarding Health Insurance",
    track: "without_children",
    step: "filing",
    relativePath:
      "1 Petition Divorce WO 1st step/Notice of Your Rights About Health Insurance Coverage drd16fz.pdf",
  },
  {
    id: "woc-service-acceptance",
    formCode: "DR22FZ",
    title: "Acceptance of Service",
    track: "without_children",
    step: "service",
    relativePath: "2 Serving The Spouse Step 2/Acceptance of service  dr22fz.pdf",
  },
  {
    id: "woc-service-affidavit",
    formCode: "DR24FZ",
    title: "Affidavit of Service with Signature Confirmation",
    track: "without_children",
    step: "service",
    relativePath:
      "2 Serving The Spouse Step 2/Affidavit of service with signature confirmation dr24fz.pdf",
  },
  {
    id: "woc-service-alt-means",
    formCode: "DR31FZ",
    title: "Affidavit of Service by Alternative Means",
    track: "without_children",
    step: "service",
    optional: true,
    relativePath:
      "2 Serving The Spouse Step 2/Affidavit of Service by Alternative Means dr31fz.pdf",
  },
  {
    id: "woc-service-motion-alt",
    formCode: "DR28FZ",
    title: "Motion to Serve by Alternative Service or Publication",
    track: "without_children",
    step: "service",
    optional: true,
    relativePath:
      "2 Serving The Spouse Step 2/Motion to serve by alternative service or publication dr28fz.pdf",
  },
  {
    id: "woc-service-order-alt",
    formCode: "DR29FZ",
    title: "Order to Serve by Alternative Service or Publication",
    track: "without_children",
    step: "service",
    optional: true,
    relativePath:
      "2 Serving The Spouse Step 2/Order to serve by alternative service or publication  dr29fz.pdf",
  },
  {
    id: "woc-service-declaration-pub",
    formCode: "DR30FZ",
    title: "Declaration Supporting Publication",
    track: "without_children",
    step: "service",
    optional: true,
    relativePath: "2 Serving The Spouse Step 2/Declaration supporting publication dr30fz.pdf",
  },
  {
    id: "woc-default-app",
    formCode: "DRD61FZ",
    title: "Application and Affidavit for Entry of Default",
    track: "without_children",
    step: "default",
    relativePath:
      "3 Default Application Step 3/Application and Affidavit for Entry of Default drd61fz.pdf",
  },
  {
    id: "woc-default-spousal",
    formCode: "DRD62FZ",
    title: "Default Information for Spousal Maintenance",
    track: "without_children",
    step: "default",
    optional: true,
    relativePath:
      "3 Default Application Step 3/Default Information for Spousal Maintenance  drd62fz.pdf",
  },
  {
    id: "woc-decree-default",
    formCode: "DRDA81FZ",
    title: "Divorce Decree — No Minor Children",
    track: "without_children",
    step: "decree",
    decreePaths: ["default_decree"],
    relativePath:
      "4 Default Hearing Step 4/Divorce Decree for Non-Covenant Marriage - No Minor Children  drda81fz.pdf",
  },
  {
    id: "woc-decree-motion-no-hearing",
    formCode: "DRD68FZ",
    title: "Motion and Affidavit for Default Decree without Hearing",
    track: "without_children",
    step: "decree",
    decreePaths: ["default_decree"],
    optional: true,
    relativePath:
      "4 Default Hearing Step 4/Motion and Affidavit for Default Decree without Hearing  drd68fz.pdf",
  },
  {
    id: "woc-consent-coversheet",
    formCode: "DRSDS10F-ANNZ",
    title: "Sensitive Data Sheet (Consent)",
    track: "without_children",
    step: "decree",
    decreePaths: ["consent_decree"],
    relativePath: "4b Consent Decree Step 4 Optional/Sensitive Data Sheet (if needed)  drsds10f-annz.pdf",
  },
  {
    id: "woc-consent-nol",
    formCode: "DRNOL70F",
    title: "Notice of Lodging",
    track: "without_children",
    step: "decree",
    decreePaths: ["consent_decree"],
    relativePath: "4b Consent Decree Step 4 Optional/Notice of Lodging drnol70f.pdf",
  },
  {
    id: "woc-consent-decree",
    formCode: "DRA71FZ",
    title: "Consent Decree",
    track: "without_children",
    step: "decree",
    decreePaths: ["consent_decree"],
    relativePath: "4b Consent Decree Step 4 Optional/Consent Decree dra71fz.pdf",
  },
];

const WC: DocumentTemplate[] = [
  {
    id: "wc-filing-coversheet",
    formCode: "DRSDS10F-CZ",
    title: "Sensitive Data Cover Sheet (With Children)",
    track: "with_children",
    step: "filing",
    relativePath: "1 Divorce WC 1st Step/Sensitive Data Cover Sheet WC drsds10f-cz.pdf",
  },
  {
    id: "wc-filing-petition",
    formCode: "DRDC15FZ",
    title: "Petition for Dissolution (With Minor Children)",
    track: "with_children",
    step: "filing",
    relativePath: "1 Divorce WC 1st Step/PEtition Divorce WC drdc15fz.pdf",
  },
  {
    id: "wc-filing-summons",
    formCode: "DR11FZ",
    title: "Summons",
    track: "with_children",
    step: "filing",
    relativePath: "1 Divorce WC 1st Step/Summons dr11fz.pdf",
  },
  {
    id: "wc-filing-injunction",
    formCode: "DR14FZ",
    title: "Preliminary Injunction",
    track: "with_children",
    step: "filing",
    relativePath: "1 Divorce WC 1st Step/Preliminary Injunction dr14fz.pdf",
  },
  {
    id: "wc-filing-creditors",
    formCode: "DR16FZ",
    title: "Notice Regarding Creditors",
    track: "with_children",
    step: "filing",
    relativePath: "1 Divorce WC 1st Step/Notice Regarding Creditors dr16fz.pdf",
  },
  {
    id: "wc-filing-insurance",
    formCode: "DRD16FZ",
    title: "Notice Regarding Health Insurance",
    track: "with_children",
    step: "filing",
    relativePath:
      "1 Divorce WC 1st Step/Notice of Your Rights About Health Insurance Coverage drd16fz.pdf",
  },
  {
    id: "wc-filing-parent-info",
    formCode: "DR12FZ",
    title: "Order and Notice for Parent Information Program",
    track: "with_children",
    step: "filing",
    relativePath:
      "1 Divorce WC 1st Step/Order and Notice for Parent Information Program dr12fz.pdf",
  },
  {
    id: "wc-filing-affidavit-children",
    formCode: "DRCVG13FZ",
    title: "Affidavit Regarding Minor Children",
    track: "with_children",
    step: "filing",
    relativePath: "1 Divorce WC 1st Step/Affidavit Regarding Minor Children drcvg13fz.pdf",
  },
  {
    id: "wc-filing-parenting-plan",
    formCode: "DRCVG11FZ",
    title: "Parenting Plan",
    track: "with_children",
    step: "filing",
    relativePath: "1 Divorce WC 1st Step/Parenting Plan drcvg11fz.pdf",
  },
  {
    id: "wc-filing-child-support-worksheet",
    formCode: "DRS12FZ",
    title: "Child Support Worksheet (ezCourtForms)",
    track: "with_children",
    step: "filing",
    optional: true,
    relativePath:
      "1 Divorce WC 1st Step/Child Support Worksheet (use ezCourtForms)  drs12fz.pdf",
  },
  {
    id: "wc-service-acceptance",
    formCode: "DR22FZ",
    title: "Acceptance of Service",
    track: "with_children",
    step: "service",
    relativePath: "2 Serving The Spouse Step 2/Acceptance of service  dr22fz.pdf",
  },
  {
    id: "wc-service-affidavit",
    formCode: "DR24FZ",
    title: "Affidavit of Service with Signature Confirmation",
    track: "with_children",
    step: "service",
    relativePath:
      "2 Serving The Spouse Step 2/Affidavit of service with signature confirmation dr24fz.pdf",
  },
  {
    id: "wc-service-alt-means",
    formCode: "DR31FZ",
    title: "Affidavit of Service by Alternative Means",
    track: "with_children",
    step: "service",
    optional: true,
    relativePath:
      "2 Serving The Spouse Step 2/Affidavit of Service by Alternative Means dr31fz.pdf",
  },
  {
    id: "wc-service-motion-alt",
    formCode: "DR28FZ",
    title: "Motion to Serve by Alternative Service or Publication",
    track: "with_children",
    step: "service",
    optional: true,
    relativePath:
      "2 Serving The Spouse Step 2/Motion to serve by alternative service or publication dr28fz.pdf",
  },
  {
    id: "wc-service-order-alt",
    formCode: "DR29FZ",
    title: "Order to Serve by Alternative Service or Publication",
    track: "with_children",
    step: "service",
    optional: true,
    relativePath:
      "2 Serving The Spouse Step 2/Order to serve by alternative service or publication  dr29fz.pdf",
  },
  {
    id: "wc-service-declaration-pub",
    formCode: "DR30FZ",
    title: "Declaration Supporting Publication",
    track: "with_children",
    step: "service",
    optional: true,
    relativePath: "2 Serving The Spouse Step 2/Declaration supporting publication dr30fz.pdf",
  },
  {
    id: "wc-default-app",
    formCode: "DRD61FZ",
    title: "Application and Affidavit for Entry of Default",
    track: "with_children",
    step: "default",
    relativePath:
      "3 Default Application Step 3/Application and Affidavit for Entry of Default drd61fz.pdf",
  },
  {
    id: "wc-default-spousal",
    formCode: "DRD62FZ",
    title: "Default Information for Spousal Maintenance",
    track: "with_children",
    step: "default",
    optional: true,
    relativePath:
      "3 Default Application Step 3/Default Information for Spousal Maintenance  drd62fz.pdf",
  },
  {
    id: "wc-decree-default",
    formCode: "DRDC81FZ",
    title: "Divorce Decree — With Minor Children",
    track: "with_children",
    step: "decree",
    decreePaths: ["default_decree"],
    relativePath: "4a Default Hearing 4th Step/Decree with minor children drdc81fz.pdf",
  },
  {
    id: "wc-decree-parenting-plan",
    formCode: "DRCVG11FZ",
    title: "Parenting Plan (Decree)",
    track: "with_children",
    step: "decree",
    decreePaths: ["default_decree"],
    relativePath: "4a Default Hearing 4th Step/Parenting Plan drcvg11fz.pdf",
  },
  {
    id: "wc-decree-nol",
    formCode: "DRNOL70F",
    title: "Notice of Lodging",
    track: "with_children",
    step: "decree",
    decreePaths: ["default_decree"],
    relativePath: "4a Default Hearing 4th Step/Notice of Lodging drnol70f.pdf",
  },
  {
    id: "wc-decree-motion-no-hearing",
    formCode: "DRD68FZ",
    title: "Motion and Affidavit for Default Decree without Hearing",
    track: "with_children",
    step: "decree",
    decreePaths: ["default_decree"],
    optional: true,
    relativePath:
      "4a Default Hearing 4th Step/Motion and Affidavit for Default Decree without Hearing drd68fz.pdf",
  },
  {
    id: "wc-decree-child-support-order",
    formCode: "DRS81FZ",
    title: "Child Support Order (ezCourtForms)",
    track: "with_children",
    step: "decree",
    decreePaths: ["default_decree"],
    optional: true,
    relativePath:
      "4a Default Hearing 4th Step/Child Support Order (use ezCourtForms) drs81fz.pdf",
  },
  {
    id: "wc-decree-child-support-worksheet",
    formCode: "DRS12FZ",
    title: "Child Support Worksheet (ezCourtForms)",
    track: "with_children",
    step: "decree",
    decreePaths: ["default_decree"],
    optional: true,
    relativePath:
      "4a Default Hearing 4th Step/Child Support Worksheet (use ezCourtForms)  drs12fz.pdf",
  },
  {
    id: "wc-decree-employer-info",
    formCode: "DRS88FZ",
    title: "Current Employer Information (ezCourtForms)",
    track: "with_children",
    step: "decree",
    decreePaths: ["default_decree"],
    optional: true,
    relativePath:
      "4a Default Hearing 4th Step/Current Employer Information (use ezCourtForms) drs88fz.pdf",
  },
  {
    id: "wc-consent-coversheet",
    formCode: "DRSDS10F",
    title: "Sensitive Data Sheet (Consent)",
    track: "with_children",
    step: "decree",
    decreePaths: ["consent_decree"],
    relativePath:
      "4b Consent Decree 4th Step Option 2/Sensitive Data Sheet (for the Respondent, if not already filed) - drsds10f.pdf",
  },
  {
    id: "wc-consent-nol",
    formCode: "DRNOL70F",
    title: "Notice of Lodging",
    track: "with_children",
    step: "decree",
    decreePaths: ["consent_decree"],
    relativePath: "4b Consent Decree 4th Step Option 2/Notice of Lodging drnol70f.pdf",
  },
  {
    id: "wc-consent-decree",
    formCode: "DR71FZ",
    title: "Consent Decree (With Minor Children)",
    track: "with_children",
    step: "decree",
    decreePaths: ["consent_decree"],
    relativePath:
      "4b Consent Decree 4th Step Option 2/Consent Decree of Divorce or Legal Separation (with minor children) dr71fz.pdf",
  },
  {
    id: "wc-consent-parenting-plan",
    formCode: "DRCVG11FZ",
    title: "Parenting Plan (Consent)",
    track: "with_children",
    step: "decree",
    decreePaths: ["consent_decree"],
    relativePath: "4b Consent Decree 4th Step Option 2/Parenting Plan drcvg11fz.pdf",
  },
  {
    id: "wc-consent-child-support-order",
    formCode: "DRS81FZ",
    title: "Child Support Order (Consent / ezCourtForms)",
    track: "with_children",
    step: "decree",
    decreePaths: ["consent_decree"],
    optional: true,
    relativePath:
      "4b Consent Decree 4th Step Option 2/Child Support Order (use ezCourtForms) drs81fz.pdf",
  },
  {
    id: "wc-consent-child-support-worksheet",
    formCode: "DRS12FZ",
    title: "Child Support Worksheet (Consent / ezCourtForms)",
    track: "with_children",
    step: "decree",
    decreePaths: ["consent_decree"],
    optional: true,
    relativePath:
      "4b Consent Decree 4th Step Option 2/Child Support Worksheet (use ezCourtForms) drs12fz.pdf",
  },
  {
    id: "wc-consent-employer-info",
    formCode: "DRS88FZ",
    title: "Current Employer Information (Consent / ezCourtForms)",
    track: "with_children",
    step: "decree",
    decreePaths: ["consent_decree"],
    optional: true,
    relativePath:
      "4b Consent Decree 4th Step Option 2/Current Employer Information (use ezCourtForms) drs88fz.pdf",
  },
];

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [...WOC, ...WC];

export type PackSelectionInput = {
  hasCommonChildren: boolean | null;
  decreePath?: DecreePath;
  includeOptional?: boolean;
  /** Default: filing only (petition packet). Pass all steps for full pack. */
  steps?: PackStep[];
};

export type DocumentPack = {
  track: CaseTrack;
  decreePath: DecreePath;
  templates: DocumentTemplate[];
};

export function resolveTrack(hasCommonChildren: boolean | null): CaseTrack {
  return hasCommonChildren === true ? "with_children" : "without_children";
}

export function selectDocumentPack(input: PackSelectionInput): DocumentPack {
  const track = resolveTrack(input.hasCommonChildren);
  const decreePath = input.decreePath ?? "default_decree";
  const includeOptional = input.includeOptional ?? false;
  const steps = input.steps ?? (["filing"] as PackStep[]);

  const templates = DOCUMENT_TEMPLATES.filter((tpl) => {
    if (tpl.track !== track) return false;
    if (!steps.includes(tpl.step)) return false;
    if (tpl.step === "decree" && tpl.decreePaths && !tpl.decreePaths.includes(decreePath)) {
      return false;
    }
    if (tpl.optional && !includeOptional) return false;
    return true;
  });

  return { track, decreePath, templates };
}

export function getTemplateById(id: string) {
  return DOCUMENT_TEMPLATES.find((t) => t.id === id);
}
