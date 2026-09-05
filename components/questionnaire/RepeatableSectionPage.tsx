import { GatedRepeatableStep } from "@/components/questionnaire/GatedRepeatableStep";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import {
  REPEATABLE_SECTION_CONFIGS,
  type RepeatableSectionSlug,
} from "@/lib/questionnaire/repeatable-configs";
import { stepLinks } from "@/lib/questionnaire/steps";

export async function RepeatableSectionPage({
  slug,
  searchParams,
}: {
  slug: RepeatableSectionSlug;
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const { caseId } = await getCurrentUserAndCase();
  const { records, gates, kase } = await loadCaseBundle(caseId);
  const cfg = REPEATABLE_SECTION_CONFIGS[slug];
  const lastCompleted = (kase as { last_completed_section?: string | null }).last_completed_section ?? null;
  const nav = stepLinks(cfg.slug, gates, lastCompleted, from === "review");

  return (
    <GatedRepeatableStep
      caseId={caseId}
      slug={cfg.slug}
      backHref={nav.backHref}
      backLabel={nav.backLabel}
      nextHref={nav.nextHref}
      submitLabel={nav.submitLabel}
      title={cfg.title}
      subtitle={cfg.subtitle}
      gateColumn={cfg.gateColumn}
      gateQuestion={cfg.gateQuestion}
      table={cfg.table}
      addLabel={cfg.addLabel}
      emptyLabel={cfg.emptyLabel}
      fields={cfg.fields}
      summary={cfg.summary}
      gateValue={gates[cfg.gateKey] as boolean | null}
      records={records[cfg.recordKey] as Array<Record<string, unknown> & { id: string }>}
    />
  );
}
