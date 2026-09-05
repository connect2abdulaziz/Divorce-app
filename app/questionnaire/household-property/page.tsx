import { GatedRepeatableStep } from "@/components/questionnaire/GatedRepeatableStep";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";

const SLUG = "household-property";

export default async function HouseholdPropertyPage({
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
      title="Household Property"
      gateQuestion="Do you have household furniture, appliances, tools, or other personal property that needs to be divided?"
      gateColumn="has_household_property"
      gateValue={gates.hasHouseholdProperty}
      table="personal_property"
      records={records.personal_property}
      addLabel="+ Add another item"
      emptyLabel="No items added yet."
      fields={[
        { name: "description", label: "Description", kind: "text", required: true },
        { name: "estimated_value", label: "Estimated value", kind: "currency" },
        {
          name: "assigned_to",
          label: "Who keeps it?",
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
          { field: "assigned_to", kind: "text", label: "Keeps it:" },
        ],
      }}
    />
  );
}
