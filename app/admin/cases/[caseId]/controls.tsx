"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function closeDialog() {
    if (isPending) return;
    setOpen(false);
    setError(null);
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (isPending || event.target !== dialogRef.current) return;
    const box = dialogRef.current.getBoundingClientRect();
    const clickedOutside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;
    if (clickedOutside) closeDialog();
  }

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteCase(caseId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <div className="print:hidden">
      <button type="button" className="btn-danger-text" onClick={() => setOpen(true)} disabled={isPending}>
        Delete case
      </button>

      <dialog
        ref={dialogRef}
        className="w-[min(100%,24rem)] rounded-2xl border border-line/80 bg-white p-0 text-ink shadow-[0_24px_64px_rgba(7,38,61,0.22)] open:flex open:flex-col backdrop:bg-[rgba(7,38,61,0.45)] backdrop:backdrop-blur-[2px]"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={closeDialog}
        onClick={handleBackdropClick}
      >
        <div className="px-6 pb-2 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-error">Delete case</p>
          <h2 id={titleId} className="mt-2 font-serif text-2xl font-semibold leading-tight text-ink">
            Delete this case permanently?
          </h2>
          <p id={descriptionId} className="mt-3 text-sm leading-relaxed text-muted">
            This removes the case and all questionnaire answers, documents, and related records. This
            cannot be undone.
          </p>
          {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 border-t border-line/70 bg-[#F7F6F1] px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={closeDialog} disabled={isPending}>
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-error px-6 py-3 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={confirmDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting…" : "Yes, delete case"}
          </button>
        </div>
      </dialog>
    </div>
  );
}
