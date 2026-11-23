import Link from "next/link";
import { notFound } from "next/navigation";
import { archiveContactMessage, restoreContactMessage } from "@/lib/admin/contact-actions";
import { requireStaff } from "@/lib/admin/current-staff";
import { createClient } from "@/lib/supabase/server";
import { MessageActions } from "./MessageActions";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = (await supabase
    .from("contact_messages" as never)
    .select("id, name, email, message, status, created_at")
    .eq("id", id)
    .maybeSingle()) as unknown as {
    data: ContactMessage | null;
    error: { message: string } | null;
  };

  if (error) throw error;
  if (!data) notFound();

  if (data.status === "new") {
    await supabase
      .from("contact_messages" as never)
      .update({ status: "read" } as never)
      .eq("id", data.id);
    data.status = "read";
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/messages" className="btn-text text-sm">
        ← All messages
      </Link>

      <div className="mt-6 rounded-2xl border border-line/80 bg-white p-6 shadow-[0_1px_2px_rgba(33,35,31,0.04),0_16px_40px_rgba(33,35,31,0.06)] md:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
          Contact request · {data.status}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">{data.name}</h1>
        <p className="mt-2 text-sm text-muted">
          <a className="btn-text" href={`mailto:${data.email}`}>
            {data.email}
          </a>
          <span aria-hidden="true"> · </span>
          {formatDate(data.created_at)}
        </p>

        <div className="mt-6 whitespace-pre-wrap rounded-xl border border-line/70 bg-[#F7F6F1] px-4 py-4 text-[15px] leading-relaxed text-ink">
          {data.message}
        </div>

        <MessageActions
          id={data.id}
          status={data.status}
          email={data.email}
          archiveAction={archiveContactMessage}
          restoreAction={restoreContactMessage}
        />
      </div>
    </div>
  );
}
