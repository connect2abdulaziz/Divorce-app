import { GatedRepeatableStep } from "@/components/questionnaire/GatedRepeatableStep";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { stepLinks } from "@/lib/questionnaire/steps";

const SLUG = "retirement";

export default async function RetirementPage({
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
      title="Retirement Accounts"
      gateQuestion="Do you or your spouse have a retirement plan, such as a 401(k), pension, or similar account?"
      gateColumn="has_retirement_accounts"
      gateValue={gates.hasRetirementAccounts}
      table="retirement_accounts"
      records={records.retirement_accounts}
      addLabel="+ Add another retirement account"
      emptyLabel="No retirement accounts added yet."
      fields={[
        { name: "plan_type", label: "Type of plan", kind: "text", required: true, },
        {
          name: "owner_party",
          label: "Owner",
          kind: "select",
          options: [
            { value: "client", label: "Me" },
            { value: "spouse", label: "Spouse" },
          ],
        },
        { name: "approximate_value", label: "Approximate value", kind: "currency" },
        { name: "division_method", label: "How should it be divided?", kind: "text" },
      ]}
      summary={{
        titleFields: ["plan_type"],
        titleFallback: "Retirement account",
        details: [
          { field: "owner_party", kind: "text", label: "Owner:" },
          { field: "approximate_value", kind: "currency", label: "Value" },
          { field: "division_method", kind: "text", label: "Division:" },
        ],
      }}
    />
  );
}
