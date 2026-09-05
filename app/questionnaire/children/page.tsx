import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";
import { ChildrenForm } from "./Form";

const SLUG = "children";

export default async function ChildrenPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const { caseId } = await getCurrentUserAndCase();
  const { records, gates, kase } = await loadCaseBundle(caseId);
  const nav = stepLinks(SLUG, gates, kase.last_completed_section, from === "review");

  return (
    <ChildrenForm
      caseId={caseId}
      slug={SLUG}
      backHref={nav.backHref}
      backLabel={nav.backLabel}
      nextHref={nav.nextHref}
      submitLabel={nav.submitLabel}
      gateValue={gates.hasCommonChildren}
      kids={records.children}
    />
  );
}
