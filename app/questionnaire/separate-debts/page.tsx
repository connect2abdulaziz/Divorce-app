import { GatedRepeatableStep } from "@/components/questionnaire/GatedRepeatableStep";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";

const SLUG = "separate-debts";

export default async function SeparateDebtsPage({
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
      title="Separate Debt"
      gateQuestion="Did you or your spouse have debts accumulated before the marriage?"
      gateColumn="has_separate_debts"
      gateValue={gates.hasSeparateDebts}
      table="separate_debts"
      records={records.separate_debts}
      addLabel="+ Add another separate debt"
      emptyLabel="No separate debts added yet."
      fields={[
        { name: "description", label: "Description / creditor", kind: "text", required: true },
        { name: "amount_owed", label: "Amount owed", kind: "currency" },
        {
          name: "owner_party",
          label: "Who owes the debt?",
          kind: "select",
          options: [
            { value: "client", label: "Me" },
            { value: "spouse", label: "Spouse" },
          ],
        },
      ]}
      summary={{
        titleFields: ["description"],
        titleFallback: "Debt",
        details: [
          { field: "amount_owed", kind: "currency", label: "Owed" },
          { field: "owner_party", kind: "text", label: "Owed by:" },
        ],
      }}
    />
  );
}
