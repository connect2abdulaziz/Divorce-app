import { GatedRepeatableStep } from "@/components/questionnaire/GatedRepeatableStep";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";

const SLUG = "real-estate";

export default async function RealEstatePage({
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
      title="Real Estate"
      gateColumn="has_real_estate"
      gateValue={gates.hasRealEstate}
      gateQuestion="Do you or your spouse own any real estate?"
      table="real_estate"
      records={records.real_estate}
      addLabel="+ Add another property"
      emptyLabel="No properties added yet."
      fields={[
        { name: "address", label: "Address", kind: "text", required: true },
        { name: "estimated_value", label: "Estimated value", kind: "currency" },
        { name: "amount_owed", label: "Amount owed (mortgage)", kind: "currency" },
        {
          name: "assigned_to",
          label: "Who keeps it?",
          kind: "select",
          options: [
            { value: "client", label: "Me" },
            { value: "spouse", label: "Spouse" },
            { value: "sell", label: "Sell it" },
            { value: "joint", label: "Keep jointly" },
          ],
        },
      ]}
      summary={{
        titleFields: ["address"],
        titleFallback: "Property",
        details: [
          { field: "estimated_value", kind: "currency", label: "Value" },
          { field: "amount_owed", kind: "currency", label: "Owed" },
          { field: "assigned_to", kind: "text", label: "Keeps it:" },
        ],
      }}
    />
  );
}
