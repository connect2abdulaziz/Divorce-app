"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCase } from "@/lib/admin/actions";

export function PrintButton() {
  return (
    <button type="button" className="btn-secondary print:hidden" onClick={() => window.print()}>
      Print / export
    </button>
  );
}

export function DeleteCaseButton({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!confirm("Delete this case and all of its data? This cannot be undone.")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteCase(caseId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <div className="print:hidden">
      <button type="button" className="btn-danger-text" onClick={handleClick} disabled={isPending}>
        {isPending ? "Deleting…" : "Delete case"}
      </button>
      {error ? <p className="mt-2 max-w-sm text-sm text-error">{error}</p> : null}
    </div>
  );
}
