"use client";

import { useRouter } from "next/navigation";
import {
  DIY_SERVICE_BENEFITS,
  DIY_SERVICE_CIRCUMSTANCES,
  DIY_SERVICE_FAQ_ITEMS,
  DIY_SERVICE_IDEAL_FOR,
  DIY_SERVICE_PROCESS_STEPS,
  GUIDED_SERVICE_BENEFITS,
  GUIDED_SERVICE_CIRCUMSTANCES,
  GUIDED_SERVICE_CIRCUMSTANCES_HEADING,
  GUIDED_SERVICE_CIRCUMSTANCES_LEDE,
  GUIDED_SERVICE_FAQ_ITEMS,
  GUIDED_SERVICE_IDEAL_FOR,
  GUIDED_SERVICE_PROCESS_FOOTNOTE,
  GUIDED_SERVICE_PROCESS_STEPS,
  SERVICE_PAGE_INTRO,
  type ServicePagePackageId,
} from "@/lib/marketing/content";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ServiceAlternativePackage } from "@/components/marketing/service/ServiceAlternativePackage";
import { ServiceBenefitsPanel } from "@/components/marketing/service/ServiceBenefitsPanel";
import { ServiceCircumstancesBand } from "@/components/marketing/service/ServiceCircumstancesBand";
import { ServiceFaqAccordion } from "@/components/marketing/service/ServiceFaqAccordion";
import { ServiceIdealStrip } from "@/components/marketing/service/ServiceIdealStrip";
import { ServicePackageIntro } from "@/components/marketing/service/ServicePackageIntro";
import { ServiceProcessRows } from "@/components/marketing/service/ServiceProcessRows";
import { ServiceQualifyCta } from "@/components/marketing/service/ServiceQualifyCta";

const PAGE_SECTIONS = {
  diy: {
    idealFor: DIY_SERVICE_IDEAL_FOR,
    benefitsHeading: "Designed to make divorce paperwork a little simpler.",
    benefits: DIY_SERVICE_BENEFITS,
    processTitle: "A clear process, one step at a time.",
    processSteps: DIY_SERVICE_PROCESS_STEPS,
    processFootnote: undefined as string | undefined,
    circumstances: DIY_SERVICE_CIRCUMSTANCES,
    circumstancesTitle: { line1: "Every divorce is different.", line2: "Your paperwork should reflect that." },
    circumstancesLede:
      "Our guided questionnaire adapts to the information you provide, helping prepare documents that reflect your Arizona divorce circumstances.",
    alternatePackage: "guided" as const,
    faqItems: DIY_SERVICE_FAQ_ITEMS,
    faqId: "diy-faq",
  },
  guided: {
    idealFor: GUIDED_SERVICE_IDEAL_FOR,
    benefitsHeading: "Designed to make the process feel more manageable.",
    benefits: GUIDED_SERVICE_BENEFITS,
    processTitle: "A clearer process, with more support.",
    processSteps: GUIDED_SERVICE_PROCESS_STEPS,
    processFootnote: GUIDED_SERVICE_PROCESS_FOOTNOTE,
    circumstances: GUIDED_SERVICE_CIRCUMSTANCES,
    circumstancesTitle: GUIDED_SERVICE_CIRCUMSTANCES_HEADING,
    circumstancesLede: GUIDED_SERVICE_CIRCUMSTANCES_LEDE,
    alternatePackage: "diy" as const,
    faqItems: GUIDED_SERVICE_FAQ_ITEMS,
    faqId: "guided-faq",
  },
} as const;

export function ServicePackagePage({ packageId }: { packageId: ServicePagePackageId }) {
  const router = useRouter();
  const intro = SERVICE_PAGE_INTRO[packageId];
  const sections = PAGE_SECTIONS[packageId];

  const startPackage = () => router.push(`/?help=${intro.helpPreference}#qualify`);
  const startQualify = () => router.push("/#qualify");

  return (
    <MarketingShell>
      <div className="ldd-service-page">
        <ServicePackageIntro
          packageId={packageId}
          intro={intro}
          onStartPackage={startPackage}
        />
        <ServiceIdealStrip statements={sections.idealFor} />
        <ServiceBenefitsPanel heading={sections.benefitsHeading} benefits={sections.benefits} />
        <ServiceProcessRows
          title={sections.processTitle}
          steps={sections.processSteps}
          footnote={sections.processFootnote}
        />
        <ServiceCircumstancesBand
          titleLine1={sections.circumstancesTitle.line1}
          titleLine2={sections.circumstancesTitle.line2}
          lede={sections.circumstancesLede}
          items={sections.circumstances}
        />
        <ServiceAlternativePackage promotePackageId={sections.alternatePackage} />
        <ServiceQualifyCta onStart={startQualify} />
        <ServiceFaqAccordion items={sections.faqItems} id={sections.faqId} />
      </div>
    </MarketingShell>
  );
}