import Link from "next/link";
import { requireStaff } from "@/lib/admin/current-staff";
import { createClient } from "@/lib/supabase/server";

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    in_progress: "bg-caution/10 text-caution",
    submitted: "bg-accent-soft text-accent-dark",
    completed: "bg-accent text-white",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs ${styles[status] ?? "bg-line text-muted"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function firstRel<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function AdminCasesPage() {
  await requireStaff();
  const supabase = await createClient();

  const { data: cases, error } = (await supabase
    .from("cases")
    .select(
      "id, questionnaire_status, submitted_at, last_saved_at, created_at, client:profiles(email, full_name), party_client(first_name, last_name)"
    )
    .order("created_at", { ascending: false })) as unknown as {
    data: Array<{
      id: string;
      questionnaire_status: string;
      submitted_at: string | null;
      last_saved_at: string | null;
      created_at: string;
      client: { email: string | null; full_name: string | null } | Array<{ email: string | null; full_name: string | null }> | null;
      party_client:
        | { first_name: string | null; last_name: string | null }
        | Array<{ first_name: string | null; last_name: string | null }>
        | null;
    }> | null;
    error: { message: string } | null;
  };

  if (error) throw error;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink">Cases</h1>
      <p className="mt-1.5 text-muted">{cases?.length ?? 0} total</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line/80 bg-white shadow-[0_1px_2px_rgba(33,35,31,0.04),0_16px_40px_rgba(33,35,31,0.06)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line/70 bg-[#F7F6F1] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last saved</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(cases ?? []).map((c) => {
              const party = firstRel(c.party_client);
              const client = firstRel(c.client);
              const name =
                [party?.first_name, party?.last_name].filter(Boolean).join(" ") || client?.full_name || "Unnamed client";
              return (
                <tr key={c.id} className="border-b border-line/70 last:border-b-0">
                  <td className="px-4 py-3 text-ink">{name}</td>
                  <td className="px-4 py-3 text-muted">{client?.email}</td>
                  <td className="px-4 py-3">{statusBadge(c.questionnaire_status)}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(c.last_saved_at)}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(c.submitted_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/cases/${c.id}`} className="btn-text">
                      Open
                    </Link>
                  </td>
                </tr>
              );
            })}
            {(cases ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No cases yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
