import Link from "next/link";
import { requireStaff } from "@/lib/admin/current-staff";
import { createClient } from "@/lib/supabase/server";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    new: "bg-accent-soft text-accent-dark",
    read: "bg-line/80 text-muted",
    archived: "bg-[#F7F6F1] text-muted",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs capitalize ${styles[status] ?? "bg-line text-muted"}`}>
      {status}
    </span>
  );
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  await requireStaff();
  const { show } = await searchParams;
  const includeArchived = show === "archived";
  const supabase = await createClient();

  let query = supabase
    .from("contact_messages" as never)
    .select("id, name, email, message, status, created_at")
    .order("created_at", { ascending: false });

  if (!includeArchived) {
    query = query.neq("status", "archived");
  }

  const { data, error } = (await query) as unknown as {
    data: ContactMessage[] | null;
    error: { message: string } | null;
  };

  if (error) throw error;

  const messages = data ?? [];
  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Messages</h1>
          <p className="mt-1.5 text-muted">
            {messages.length} shown
            {newCount > 0 ? ` · ${newCount} new` : ""}
          </p>
        </div>
        <Link
          href={includeArchived ? "/admin/messages" : "/admin/messages?show=archived"}
          className="btn-text text-sm"
        >
          {includeArchived ? "Hide archived" : "Show archived"}
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line/80 bg-white shadow-[0_1px_2px_rgba(33,35,31,0.04),0_16px_40px_rgba(33,35,31,0.06)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line/70 bg-[#F7F6F1] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Preview</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id} className="border-b border-line/70 last:border-b-0">
                <td className="px-4 py-3 font-medium text-ink">{m.name}</td>
                <td className="px-4 py-3 text-muted">{m.email}</td>
                <td className="max-w-[18rem] truncate px-4 py-3 text-muted">{m.message}</td>
                <td className="px-4 py-3">{statusBadge(m.status)}</td>
                <td className="px-4 py-3 text-muted">{formatDate(m.created_at)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/messages/${m.id}`} className="btn-text">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No contact messages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
