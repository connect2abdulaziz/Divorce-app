"use client";

import { useState, useTransition } from "react";
import { Spinner } from "@/components/ui/SubmitButton";

export function GenerateDocumentsButton({
  caseId,
  className = "btn-primary",
  label = "Generate documents",
  steps = "filing",
}: {
  caseId: string;
  className?: string;
  label?: string;
  steps?: "filing" | "full";
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/cases/${caseId}/documents/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ steps, decreePath: "default_decree" }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(data?.error || `Failed (${res.status})`);
        }
        const blob = await res.blob();
        const disposition = res.headers.get("Content-Disposition") || "";
        const match = /filename="([^"]+)"/.exec(disposition);
        const fileName = match?.[1] || "divorce-documents.pdf";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed");
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-stretch gap-1">
      <button
        type="button"
        className={className}
        disabled={isPending}
        aria-busy={isPending}
        onClick={handleClick}
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            Generating…
          </span>
        ) : (
          label
        )}
      </button>
      {error ? <p className="max-w-xs text-xs text-error">{error}</p> : null}
    </div>
  );
}
