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
        <Row
          label="Name"
          value={[c.first_name, c.middle_name, c.last_name].filter(Boolean).join(" ") as string}
        />
        <Row label="Date of birth" value={c.date_of_birth as ReactNode} />
        <Row label="Height" value={c.height as ReactNode} />
        <Row label="Weight" value={c.weight_lbs != null ? `${c.weight_lbs} lbs` : null} />
        <Row
          label="Arizona residency"
          value={
            c.az_years != null || c.az_months != null
              ? `${c.az_years ?? 0} yr ${c.az_months ?? 0} mo`
              : null
          }
        />
        <Row
          label="Address"
          value={[c.address_line1, c.address_line2, c.city, c.state, c.zip].filter(Boolean).join(", ")}
        />
        <Row label="Home phone" value={(c.home_phone as ReactNode) ?? (c.phone as ReactNode)} />
        <Row label="Cell phone" value={c.cell_phone as ReactNode} />
        <Row label="Email" value={c.email as ReactNode} />
        <Row label="SSN (last 4)" value={c.ssn_last4 ? `•••-••-${c.ssn_last4}` : null} />
      </Group>

      <Group title="Spouse Information" editHref={edit("spouse-info")}>
        <Row
          label="Name"
          value={[s.first_name, s.middle_name, s.last_name].filter(Boolean).join(" ") as string}
        />
        <Row label="Date of birth" value={s.date_of_birth as ReactNode} />
        <Row label="Height" value={s.height as ReactNode} />
        <Row label="Weight" value={s.weight_lbs != null ? `${s.weight_lbs} lbs` : null} />
        <Row
          label="Arizona residency"
          value={
            s.az_years != null || s.az_months != null
              ? `${s.az_years ?? 0} yr ${s.az_months ?? 0} mo`
              : null
          }
        />
        <Row
          label="Address"
          value={
            s.address_unknown
              ? "Unknown"
              : ([s.address_line1, s.address_line2, s.city, s.state, s.zip].filter(Boolean).join(", ") ||
                  null)
          }
        />
        <Row
          label="Home phone"
          value={s.phone_unknown ? "Unknown" : ((s.home_phone as ReactNode) ?? (s.phone as ReactNode))}
        />
        <Row label="Cell phone" value={s.phone_unknown ? "Unknown" : (s.cell_phone as ReactNode)} />
        <Row label="Email" value={s.email as ReactNode} />
        <Row
          label="SSN (last 4)"
          value={s.ssn_unknown ? "Unknown" : s.ssn_last4 ? `•••-••-${s.ssn_last4}` : null}
        />
      </Group>

      <Group title="Marriage" editHref={edit("marriage")}>
        <Row label="Married" value={m.marriage_date as ReactNode} />
        <Row label="Separated" value={m.separation_date as ReactNode} />
        <Row
          label="Place"
          value={
            ([m.marriage_city, m.marriage_state].filter(Boolean).join(", ") ||
              (m.marriage_location as string)) as ReactNode
          }
        />
        <Row label="Grounds" value={m.grounds as ReactNode} />
        <Row
          label="Name restoration"
          value={
            m.restore_former_name
              ? ([m.restored_first_name, m.restored_middle_name, m.restored_last_name]
                  .filter(Boolean)
                  .join(" ") as string) || "Yes"
              : m.restore_former_name === false
                ? "No"
                : null
          }
        />
        {gates.isSpousePregnant ? (
          <>
            <Row label="Pregnant" value="Yes" />
            <Row
              label="Spouse is father"
              value={
                m.spouse_is_father === true ? "Yes" : m.spouse_is_father === false ? "No" : null
              }
            />
            <Row label="Due date" value={m.due_date as ReactNode} />
          </>
        ) : null}
      </Group>

      <Group title="Employment" editHref={edit("employment")}>
        <Row
          label="You"
          value={
            e.client_status === "employed"
              ? ([e.client_employer_name, e.client_position].filter(Boolean).join(" · ") as string) ||
                "Employed"
              : e.client_status === "not_employed"
                ? "Not employed"
                : (e.client_status as ReactNode)
          }
        />
        {e.client_status === "employed" ? (
          <>
            <Row label="Your monthly income" value={money(e.client_monthly_income)} />
            <Row label="Your employer phone" value={e.client_employer_phone as ReactNode} />
          </>
        ) : null}
        <Row
          label="Spouse"
          value={
            e.spouse_status === "employed"
              ? ([e.spouse_employer_name, e.spouse_position].filter(Boolean).join(" · ") as string) ||
                "Employed"
              : e.spouse_status === "unknown"
                ? "Unknown"
                : e.spouse_status === "not_employed"
                  ? "Not employed"
                  : (e.spouse_status as ReactNode)
          }
        />
        {e.spouse_status === "employed" ? (
          <>
            <Row label="Spouse monthly income" value={money(e.spouse_monthly_income)} />
            <Row label="Spouse employer phone" value={e.spouse_employer_phone as ReactNode} />
          </>
        ) : null}
      </Group>

      <Group title="Domestic Violence" editHref={edit("domestic-violence")}>
        <Row label="History of DV" value={dv.has_domestic_violence ? "Yes" : "No"} />
        {dv.has_domestic_violence ? (
          <>
            <Row label="Order of protection" value={dv.order_of_protection_exists ? "Yes" : "No"} />
            {dv.order_of_protection_exists ? (
              <>
                <Row
                  label="Filed by"
                  value={
                    dv.filed_by === "client" ? "Me" : dv.filed_by === "spouse" ? "Spouse" : (dv.filed_by as ReactNode)
                  }
                />
                <Row label="Against whom" value={dv.against_whom as ReactNode} />
                <Row label="Date issued" value={dv.date_issued as ReactNode} />
                <Row
                  label="City / state"
                  value={[dv.oop_city, dv.oop_state].filter(Boolean).join(", ") || null}
                />
              </>
            ) : null}
          </>
        ) : null}
      </Group>

      <Group title="Children" editHref={edit("children")}>
        {!gates.hasCommonChildren && <p className="text-muted">No common children.</p>}
        {records.children.map(
          (child: {
            id: string;
            first_name: string | null;
            middle_name?: string | null;
            last_name: string | null;
            date_of_birth: string | null;
            ssn_last4?: string | null;
          }) => (
            <Row
              key={child.id}
              label={[child.first_name, child.middle_name, child.last_name].filter(Boolean).join(" ")}
              value={
                [
                  child.date_of_birth ? `Born ${child.date_of_birth}` : null,
                  child.ssn_last4 ? `SSN •••-••-${child.ssn_last4}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || null
              }
            />
          )
        )}
      </Group>

      {gates.hasCommonChildren && (
        <Group title="Custody / Parenting" editHref={edit("parenting")}>
          <Row
            label="Custody"
            value={
              p.custody_arrangement === "joint"
                ? "Joint custody"
                : p.custody_arrangement === "sole"
                  ? "Sole custody"
                  : (p.custody_arrangement as ReactNode)
            }
          />
          <Row
            label="Visitation"
            value={
              p.visitation_wanted === true
                ? "Yes"
                : p.visitation_wanted === false
                  ? "No"
                  : null
            }
          />
          {p.visitation_wanted === false ? (
            <Row label="Why no visitation" value={p.visitation_denied_reason as ReactNode} />
          ) : null}
          <Row label="Parenting time" value={p.parenting_time_schedule as ReactNode} />
        </Group>
      )}

      {gates.hasCommonChildren && (
        <Group title="Tax Information" editHref={edit("tax-information")}>
          <Row
            label="Claimed by"
            value={
              t.dependents_claimed_by === "client"
                ? "Me"
                : t.dependents_claimed_by === "spouse"
                  ? "Spouse"
                  : (t.dependents_claimed_by as ReactNode)
            }
          />
          <Row
            label="How often"
            value={
              t.claim_frequency === "every_year"
                ? "Every year"
                : t.claim_frequency === "alternate_years"
                  ? "Alternate years"
                  : (t.claim_frequency as ReactNode)
            }
          />
          <Row label="Notes" value={t.notes as ReactNode} />
        </Group>
      )}

      <Group title="Community Property" editHref={edit("community-property")}>
        <Row
          label="Has community property"
          value={
            gates.hasCommunityProperty === true
              ? "Yes"
              : gates.hasCommunityProperty === false
                ? "No"
                : null
          }
        />
      </Group>

      {gates.hasCommunityProperty !== false ? (
        <>
      <Group title="Real Estate" editHref={edit("real-estate")}>
        {!gates.hasRealEstate && <p className="text-muted">No real estate.</p>}
        {records.real_estate.map(
          (r: {
            id: string;
            address: string | null;
            estimated_value: number | null;
            assigned_to: string | null;
          }) => {
            const disposition =
              r.assigned_to === "sell"
                ? "Sell & split 50/50"
                : r.assigned_to === "client"
                  ? "I keep it"
                  : r.assigned_to === "spouse"
                    ? "Spouse keeps it"
                    : r.assigned_to === "joint"
                      ? "Keep jointly"
                      : r.assigned_to;
            return (
              <Row
                key={r.id}
                label={r.address || "Property"}
                value={`${money(r.estimated_value)} · ${disposition ?? "—"}`}
              />
            );
          }
        )}
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
        </>
      ) : null}

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
