import { notFound } from "next/navigation";
import { FormPanel } from "@/components/questionnaire/FormPanel";
import { CaseSummary } from "@/components/questionnaire/CaseSummary";
import { requireStaff } from "@/lib/admin/current-staff";
import { markCaseCompleted, reopenCase } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/server";
import { DeleteCaseButton, PrintButton } from "./controls";

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

function firstRel<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function AdminCaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  await requireStaff();
  const { caseId } = await params;
  const supabase = await createClient();

  const { data: kase, error } = (await supabase
    .from("cases")
    .select("*, client:profiles(email, full_name)")
    .eq("id", caseId)
    .single()) as unknown as {
    data: {
      id: string;
      questionnaire_status: string;
      last_saved_at: string | null;
      submitted_at: string | null;
      client: { email: string | null; full_name: string | null } | Array<{ email: string | null; full_name: string | null }> | null;
    } | null;
    error: { message: string } | null;
  };

  if (error || !kase) notFound();

  const client = firstRel(kase.client);
  const clientName = client?.full_name || "Unnamed client";

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">{clientName}</h1>
          <p className="mt-1 text-muted">{client?.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <PrintButton />
          <button
            type="button"
            className="btn-secondary cursor-not-allowed opacity-50"
            disabled
            title="Coming in the document generation phase"
          >
            Generate documents
          </button>
          <DeleteCaseButton caseId={kase.id} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-line/80 bg-white p-4 text-sm print:hidden sm:grid-cols-3">
        <div>
          <p className="text-muted">Status</p>
          <p className="text-ink">{kase.questionnaire_status.replace("_", " ")}</p>
        </div>
        <div>
          <p className="text-muted">Last saved</p>
          <p className="text-ink">{formatDate(kase.last_saved_at)}</p>
        </div>
        <div>
          <p className="text-muted">Submitted</p>
          <p className="text-ink">{formatDate(kase.submitted_at)}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-4 print:hidden">
        {kase.questionnaire_status !== "completed" ? (
          <form action={markCaseCompleted.bind(null, kase.id)}>
            <button type="submit" className="btn-text text-sm">
              Mark as completed
            </button>
          </form>
        ) : (
          <form action={reopenCase.bind(null, kase.id)}>
            <button type="submit" className="btn-text text-sm">
              Reopen case
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 print:mt-0">
        <h2 className="mb-4 hidden font-serif text-xl font-semibold text-ink print:block">
          {clientName} — Questionnaire
        </h2>
        <FormPanel>
          <div className="px-6 md:px-8">
            <CaseSummary caseId={kase.id} editHrefFor={(slug) => `/admin/cases/${kase.id}/${slug}`} />
          </div>
        </FormPanel>
      </div>
    </div>
  );
}
