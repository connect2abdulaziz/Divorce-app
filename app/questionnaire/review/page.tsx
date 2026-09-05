import Link from "next/link";
import { FormPanel } from "@/components/questionnaire/FormPanel";
import { getCurrentUserAndCase } from "@/lib/questionnaire/current-case";
import { loadCaseBundle } from "@/lib/questionnaire/data";

function money(v: unknown) {
  return v == null ? "—" : `$${Number(v).toLocaleString()}`;
}

function ReviewGroup({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-line/70 py-6 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>
        <Link href={editHref} className="btn-text text-sm">
          Edit
        </Link>
      </div>
      <div className="mt-3 text-sm text-ink">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-0.5">
      <span className="w-40 shrink-0 text-muted">{label}</span>
      <span>{value ?? "—"}</span>
    </div>
  );
}

export default async function ReviewPage() {
  const { caseId } = await getCurrentUserAndCase();
  const { sections, records, gates } = await loadCaseBundle(caseId);

  const c = sections.party_client;
  const s = sections.party_spouse;
  const m = sections.marriage;
  const e = sections.employment;
  const dv = sections.domestic_violence;
  const p = sections.parenting;
  const t = sections.tax_information;

  return (
    <FormPanel>
      <div className="border-b border-line/70 px-6 py-7 md:px-8">
        <h2 className="font-serif text-[1.75rem] font-semibold leading-tight text-ink">Review your answers</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Check everything below before submitting. You can jump back to any section to make a correction.
        </p>
      </div>

      <div className="px-6 md:px-8">
        <ReviewGroup title="Your Information" editHref="/questionnaire/client-info?from=review">
          <Row label="Name" value={[c.first_name, c.last_name].filter(Boolean).join(" ")} />
          <Row label="Date of birth" value={c.date_of_birth} />
          <Row label="Address" value={[c.address_line1, c.city, c.state, c.zip].filter(Boolean).join(", ")} />
          <Row label="Phone" value={c.phone} />
          <Row label="Email" value={c.email} />
        </ReviewGroup>

        <ReviewGroup title="Spouse Information" editHref="/questionnaire/spouse-info?from=review">
          <Row label="Name" value={[s.first_name, s.last_name].filter(Boolean).join(" ")} />
          <Row label="Date of birth" value={s.date_of_birth} />
          <Row label="Address" value={[s.address_line1, s.city, s.state, s.zip].filter(Boolean).join(", ")} />
        </ReviewGroup>

        <ReviewGroup title="Marriage" editHref="/questionnaire/marriage?from=review">
          <Row label="Married" value={m.marriage_date} />
          <Row label="Separated" value={m.separation_date} />
          <Row label="Location" value={m.marriage_location} />
          <Row label="Grounds" value={m.grounds} />
          {gates.isSpousePregnant && <Row label="Due date" value={m.due_date} />}
        </ReviewGroup>

        <ReviewGroup title="Employment" editHref="/questionnaire/employment?from=review">
          <Row label="You" value={e.client_status === "employed" ? e.client_employer_name || "Employed" : "Not employed"} />
          <Row
            label="Spouse"
            value={e.spouse_status === "employed" ? e.spouse_employer_name || "Employed" : e.spouse_status}
          />
        </ReviewGroup>

        <ReviewGroup title="Domestic Violence" editHref="/questionnaire/domestic-violence?from=review">
          <Row label="History of DV" value={dv.has_domestic_violence ? "Yes" : "No"} />
          {dv.has_domestic_violence && (
            <Row label="Order of protection" value={dv.order_of_protection_exists ? "Yes" : "No"} />
          )}
        </ReviewGroup>

        <ReviewGroup title="Children" editHref="/questionnaire/children?from=review">
          {!gates.hasCommonChildren && <p className="text-muted">No common children.</p>}
          {records.children.map((child: any) => (
            <Row
              key={child.id}
              label={[child.first_name, child.last_name].filter(Boolean).join(" ")}
              value={child.date_of_birth ? `Born ${child.date_of_birth}` : null}
            />
          ))}
        </ReviewGroup>

        {gates.hasCommonChildren && (
          <ReviewGroup title="Custody / Parenting" editHref="/questionnaire/parenting?from=review">
            <Row label="Custody" value={p.custody_arrangement} />
            <Row label="Decision-making" value={p.decision_making} />
            <Row label="Parenting time" value={p.parenting_time_schedule} />
          </ReviewGroup>
        )}

        <ReviewGroup title="Tax Information" editHref="/questionnaire/tax-information?from=review">
          <Row label="Filing status" value={t.filing_status} />
          <Row label="Dependents claimed by" value={t.dependents_claimed_by} />
        </ReviewGroup>

        <ReviewGroup title="Real Estate" editHref="/questionnaire/real-estate?from=review">
          {!gates.hasRealEstate && <p className="text-muted">No real estate.</p>}
          {records.real_estate.map((r: any) => (
            <Row key={r.id} label={r.address || "Property"} value={`${money(r.estimated_value)} · ${r.assigned_to ?? "—"}`} />
          ))}
        </ReviewGroup>

        <ReviewGroup title="Vehicles" editHref="/questionnaire/vehicles?from=review">
          {!gates.hasVehicles && <p className="text-muted">No vehicles.</p>}
          {records.vehicles.map((v: any) => (
            <Row
              key={v.id}
              label={[v.year, v.make, v.model].filter(Boolean).join(" ")}
              value={`${money(v.estimated_value)} · ${v.assigned_to ?? "—"}`}
            />
          ))}
        </ReviewGroup>

        <ReviewGroup title="Retirement" editHref="/questionnaire/retirement?from=review">
          {!gates.hasRetirementAccounts && <p className="text-muted">No retirement accounts.</p>}
          {records.retirement_accounts.map((r: any) => (
            <Row key={r.id} label={r.plan_type || "Account"} value={`${money(r.approximate_value)} · ${r.owner_party ?? "—"}`} />
          ))}
        </ReviewGroup>

        <ReviewGroup title="Community Debts" editHref="/questionnaire/community-debts?from=review">
          {!gates.hasCommunityDebts && <p className="text-muted">No community debts.</p>}
          {records.community_debts.map((d: any) => (
            <Row
              key={d.id}
              label={d.creditor || "Debt"}
              value={`Total ${money(d.amount_owed)} · You ${money(d.amount_client_pays)} · Spouse ${money(d.amount_spouse_pays)}`}
            />
          ))}
        </ReviewGroup>

        <ReviewGroup title="Household Property" editHref="/questionnaire/household-property?from=review">
          {!gates.hasHouseholdProperty && <p className="text-muted">Nothing to divide.</p>}
          {records.personal_property.map((p2: any) => (
            <Row key={p2.id} label={p2.description || "Item"} value={`${money(p2.estimated_value)} · ${p2.assigned_to ?? "—"}`} />
          ))}
        </ReviewGroup>

        <ReviewGroup title="Separate Property" editHref="/questionnaire/separate-property?from=review">
          {!gates.hasSeparateProperty && <p className="text-muted">No separate property.</p>}
          {records.separate_property.map((p3: any) => (
            <Row key={p3.id} label={p3.description || "Item"} value={`${money(p3.estimated_value)} · ${p3.owner_party ?? "—"}`} />
          ))}
        </ReviewGroup>

        <ReviewGroup title="Separate Debts" editHref="/questionnaire/separate-debts?from=review">
          {!gates.hasSeparateDebts && <p className="text-muted">No separate debts.</p>}
          {records.separate_debts.map((d2: any) => (
            <Row key={d2.id} label={d2.description || "Debt"} value={`${money(d2.amount_owed)} · ${d2.owner_party ?? "—"}`} />
          ))}
        </ReviewGroup>
      </div>

      <div className="flex justify-end border-t border-line/70 bg-[#F7F6F1] px-6 py-5 md:px-8">
        <Link href="/questionnaire/submit" className="btn-primary">
          Continue to submit
        </Link>
      </div>
    </FormPanel>
  );
}
