import { GatedRepeatableStep } from "@/components/questionnaire/GatedRepeatableStep";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";

const SLUG = "vehicles";

export default async function VehiclesPage({
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
      title="Vehicles"
      gateColumn="has_vehicles"
      gateValue={gates.hasVehicles}
      gateQuestion="Do you or your spouse own any vehicles?"
      table="vehicles"
      records={records.vehicles}
      addLabel="+ Add another vehicle"
      emptyLabel="No vehicles added yet."
      fields={[
        { name: "make", label: "Make", kind: "text", required: true },
        { name: "model", label: "Model", kind: "text", required: true },
        { name: "year", label: "Year", kind: "number" },
        { name: "estimated_value", label: "Estimated value", kind: "currency" },
        { name: "amount_owed", label: "Amount owed", kind: "currency" },
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
        titleFields: ["year", "make", "model"],
        titleFallback: "Vehicle",
        details: [
          { field: "estimated_value", kind: "currency", label: "Value" },
          { field: "amount_owed", kind: "currency", label: "Owed" },
          { field: "assigned_to", kind: "text", label: "Keeps it:" },
        ],
      }}
    />
  );
}
