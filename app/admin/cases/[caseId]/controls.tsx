"use client";

import { useTransition } from "react";
import { deleteCase } from "@/lib/admin/actions";

export function PrintButton() {
  return (
    <button type="button" className="btn-secondary print:hidden" onClick={() => window.print()}>
      Print / export
    </button>
  );
}

export function DeleteCaseButton({ caseId }: { caseId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Delete this case and all of its data? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteCase(caseId);
    });
  }

  return (
    <button type="button" className="btn-danger-text print:hidden" onClick={handleClick} disabled={isPending}>
      {isPending ? "Deleting…" : "Delete case"}
    </button>
  );
}
