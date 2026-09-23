import { redirect } from "next/navigation";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";
import { TaxInformationForm } from "./Form";

const SLUG = "tax-information";

export default async function TaxInformationPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const { caseId } = await getCurrentUserAndCase();
  const { sections, gates, kase } = await loadCaseBundle(caseId);

  if (gates.hasCommonChildren !== true) {
    redirect(from === "review" ? "/questionnaire/children?from=review" : "/questionnaire/children");
  }

  const nav = stepLinks(SLUG, gates, kase.last_completed_section, from === "review");

  return (
    <TaxInformationForm
      caseId={caseId}
      slug={SLUG}
      backHref={nav.backHref}
      backLabel={nav.backLabel}
      nextHref={nav.nextHref}
      submitLabel={nav.submitLabel}
      initial={sections.tax_information}
    />
  );
}
