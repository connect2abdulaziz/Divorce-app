import { GatedRepeatableStep } from "@/components/questionnaire/GatedRepeatableStep";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";

const SLUG = "separate-property";

export default async function SeparatePropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const { caseId } = await getCurrentUserAndCase();
  const { records, gates, kase } = await loadCaseBundle(caseId);
  const nav = stepLinks(SLUG, gates, kase.last_completed_section, from === "review");

  return (
    <GatedRepeatableStep
      caseId={caseId}
      slug={SLUG}
      backHref={nav.backHref}
      backLabel={nav.backLabel}
      nextHref={nav.nextHref}
      submitLabel={nav.submitLabel}
      title="Separate Property"
      gateQuestion="Did you or your spouse have property acquired before the marriage?"
      gateColumn="has_separate_property"
      gateValue={gates.hasSeparateProperty}
      table="separate_property"
      records={records.separate_property}
      addLabel="+ Add another separate property item"
      emptyLabel="No separate property added yet."
      fields={[
        { name: "description", label: "Description", kind: "text", required: true },
        { name: "estimated_value", label: "Estimated value", kind: "currency" },
        {
          name: "owner_party",
          label: "Owner",
          kind: "select",
          options: [
            { value: "client", label: "Me" },
            { value: "spouse", label: "Spouse" },
          ],
        },
      ]}
      summary={{
        titleFields: ["description"],
        titleFallback: "Item",
        details: [
          { field: "estimated_value", kind: "currency", label: "Value" },
          { field: "owner_party", kind: "text", label: "Owner:" },
        ],
      }}
    />
  );
}
