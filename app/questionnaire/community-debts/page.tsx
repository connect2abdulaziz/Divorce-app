import { GatedRepeatableStep } from "@/components/questionnaire/GatedRepeatableStep";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";

const SLUG = "community-debts";

export default async function CommunityDebtsPage({
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
      title="Community Debts"
      subtitle="The amounts you and your spouse will each pay should normally add up to the total owed."
      gateQuestion="Do you or your spouse have debts that need to be divided?"
      gateColumn="has_community_debts"
      gateValue={gates.hasCommunityDebts}
      table="community_debts"
      records={records.community_debts}
      addLabel="+ Add another debt"
      emptyLabel="No community debts added yet."
      fields={[
        { name: "creditor", label: "Creditor / type of debt", kind: "text", required: true },
        { name: "amount_owed", label: "Total amount owed", kind: "currency" },
        { name: "amount_client_pays", label: "Amount you will pay", kind: "currency" },
        { name: "amount_spouse_pays", label: "Amount spouse will pay", kind: "currency" },
      ]}
      summary={{
        titleFields: ["creditor"],
        titleFallback: "Debt",
        details: [
          { field: "amount_owed", kind: "currency", label: "Total" },
          { field: "amount_client_pays", kind: "currency", label: "You pay" },
          { field: "amount_spouse_pays", kind: "currency", label: "Spouse pays" },
        ],
      }}
    />
  );
}
