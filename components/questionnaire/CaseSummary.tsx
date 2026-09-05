import type { ReactNode } from "react";
import Link from "next/link";
import { loadCaseBundle } from "@/lib/questionnaire/data";

function money(v: unknown) {
  return v == null ? "—" : `$${Number(v).toLocaleString()}`;
}

function Group({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-line/70 py-6 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>
        {editHref && (
          <Link href={editHref} className="btn-text text-sm print:hidden">
            Edit
          </Link>
        )}
      </div>
      <div className="mt-3 text-sm text-ink">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex gap-2 py-0.5">
      <span className="w-40 shrink-0 text-muted">{label}</span>
      <span>{value ?? "—"}</span>
    </div>
  );
}

export async function CaseSummary({
  caseId,
  editHrefFor,
}: {
  caseId: string;
  editHrefFor?: (slug: string) => string;
}) {
  const { sections, records, gates } = await loadCaseBundle(caseId);

  type Row = Record<string, unknown>;
  const c = (sections.party_client ?? {}) as Row;
  const s = (sections.party_spouse ?? {}) as Row;
  const m = (sections.marriage ?? {}) as Row;
  const e = (sections.employment ?? {}) as Row;
  const dv = (sections.domestic_violence ?? {}) as Row;
  const p = (sections.parenting ?? {}) as Row;
  const t = (sections.tax_information ?? {}) as Row;

  const edit = (slug: string) => editHrefFor?.(slug);

  return (
    <div>
      <Group title="Your Information" editHref={edit("client-info")}>
        <Row label="Name" value={[c.first_name, c.last_name].filter(Boolean).join(" ") as string} />
        <Row label="Date of birth" value={c.date_of_birth as ReactNode} />
        <Row label="Address" value={[c.address_line1, c.city, c.state, c.zip].filter(Boolean).join(", ")} />
        <Row label="Phone" value={c.phone as ReactNode} />
        <Row label="Email" value={c.email as ReactNode} />
      </Group>

      <Group title="Spouse Information" editHref={edit("spouse-info")}>
        <Row label="Name" value={[s.first_name, s.last_name].filter(Boolean).join(" ") as string} />
        <Row label="Date of birth" value={s.date_of_birth as ReactNode} />
        <Row label="Address" value={[s.address_line1, s.city, s.state, s.zip].filter(Boolean).join(", ")} />
      </Group>

      <Group title="Marriage" editHref={edit("marriage")}>
        <Row label="Married" value={m.marriage_date as ReactNode} />
        <Row label="Separated" value={m.separation_date as ReactNode} />
        <Row label="Location" value={m.marriage_location as ReactNode} />
        <Row label="Grounds" value={m.grounds as ReactNode} />
        {gates.isSpousePregnant && <Row label="Due date" value={m.due_date as ReactNode} />}
      </Group>

      <Group title="Employment" editHref={edit("employment")}>
        <Row
          label="You"
          value={e.client_status === "employed" ? (e.client_employer_name as string) || "Employed" : "Not employed"}
        />
        <Row
          label="Spouse"
          value={e.spouse_status === "employed" ? (e.spouse_employer_name as string) || "Employed" : (e.spouse_status as ReactNode)}
        />
      </Group>

      <Group title="Domestic Violence" editHref={edit("domestic-violence")}>
        <Row label="History of DV" value={dv.has_domestic_violence ? "Yes" : "No"} />
        {dv.has_domestic_violence ? (
          <Row label="Order of protection" value={dv.order_of_protection_exists ? "Yes" : "No"} />
        ) : null}
      </Group>

      <Group title="Children" editHref={edit("children")}>
        {!gates.hasCommonChildren && <p className="text-muted">No common children.</p>}
        {records.children.map((child: { id: string; first_name: string | null; last_name: string | null; date_of_birth: string | null }) => (
          <Row
            key={child.id}
            label={[child.first_name, child.last_name].filter(Boolean).join(" ")}
            value={child.date_of_birth ? `Born ${child.date_of_birth}` : null}
          />
        ))}
      </Group>

      {gates.hasCommonChildren && (
        <Group title="Custody / Parenting" editHref={edit("parenting")}>
          <Row label="Custody" value={p.custody_arrangement as ReactNode} />
          <Row label="Decision-making" value={p.decision_making as ReactNode} />
          <Row label="Parenting time" value={p.parenting_time_schedule as ReactNode} />
        </Group>
      )}

      <Group title="Tax Information" editHref={edit("tax-information")}>
        <Row label="Filing status" value={t.filing_status as ReactNode} />
        <Row label="Dependents claimed by" value={t.dependents_claimed_by as ReactNode} />
      </Group>

      <Group title="Real Estate" editHref={edit("real-estate")}>
        {!gates.hasRealEstate && <p className="text-muted">No real estate.</p>}
        {records.real_estate.map((r: { id: string; address: string | null; estimated_value: number | null; assigned_to: string | null }) => (
          <Row key={r.id} label={r.address || "Property"} value={`${money(r.estimated_value)} · ${r.assigned_to ?? "—"}`} />
        ))}
      </Group>

      <Group title="Vehicles" editHref={edit("vehicles")}>
        {!gates.hasVehicles && <p className="text-muted">No vehicles.</p>}
        {records.vehicles.map((v: { id: string; year: number | null; make: string | null; model: string | null; estimated_value: number | null; assigned_to: string | null }) => (
          <Row
            key={v.id}
            label={[v.year, v.make, v.model].filter(Boolean).join(" ")}
            value={`${money(v.estimated_value)} · ${v.assigned_to ?? "—"}`}
          />
        ))}
      </Group>

      <Group title="Retirement" editHref={edit("retirement")}>
        {!gates.hasRetirementAccounts && <p className="text-muted">No retirement accounts.</p>}
        {records.retirement_accounts.map((r: { id: string; plan_type: string | null; approximate_value: number | null; owner_party: string | null }) => (
          <Row key={r.id} label={r.plan_type || "Account"} value={`${money(r.approximate_value)} · ${r.owner_party ?? "—"}`} />
        ))}
      </Group>

      <Group title="Community Debts" editHref={edit("community-debts")}>
        {!gates.hasCommunityDebts && <p className="text-muted">No community debts.</p>}
        {records.community_debts.map((d: { id: string; creditor: string | null; amount_owed: number | null; amount_client_pays: number | null; amount_spouse_pays: number | null }) => (
          <Row
            key={d.id}
            label={d.creditor || "Debt"}
            value={`Total ${money(d.amount_owed)} · You ${money(d.amount_client_pays)} · Spouse ${money(d.amount_spouse_pays)}`}
          />
        ))}
      </Group>

      <Group title="Household Property" editHref={edit("household-property")}>
        {!gates.hasHouseholdProperty && <p className="text-muted">Nothing to divide.</p>}
        {records.personal_property.map((item: { id: string; description: string | null; estimated_value: number | null; assigned_to: string | null }) => (
          <Row key={item.id} label={item.description || "Item"} value={`${money(item.estimated_value)} · ${item.assigned_to ?? "—"}`} />
        ))}
      </Group>

      <Group title="Separate Property" editHref={edit("separate-property")}>
        {!gates.hasSeparateProperty && <p className="text-muted">No separate property.</p>}
        {records.separate_property.map((item: { id: string; description: string | null; estimated_value: number | null; owner_party: string | null }) => (
          <Row key={item.id} label={item.description || "Item"} value={`${money(item.estimated_value)} · ${item.owner_party ?? "—"}`} />
        ))}
      </Group>

      <Group title="Separate Debts" editHref={edit("separate-debts")}>
        {!gates.hasSeparateDebts && <p className="text-muted">No separate debts.</p>}
        {records.separate_debts.map((d: { id: string; description: string | null; amount_owed: number | null; owner_party: string | null }) => (
          <Row key={d.id} label={d.description || "Debt"} value={`${money(d.amount_owed)} · ${d.owner_party ?? "—"}`} />
        ))}
      </Group>
    </div>
  );
}
