"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function MessageActions({
  id,
  status,
  email,
  archiveAction,
  restoreAction,
}: {
  id: string;
  status: string;
  email: string;
  archiveAction: (id: string) => Promise<void>;
  restoreAction: (id: string) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const replyHref = `mailto:${email}?subject=${encodeURIComponent("Re: your Legal Divorce Docs message")}`;

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {status === "archived" ? (
        <button
          type="button"
          className="btn-secondary"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await restoreAction(id);
              router.refresh();
            })
          }
        >
          Restore
        </button>
      ) : (
        <button
          type="button"
          className="btn-secondary"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await archiveAction(id);
              router.push("/admin/messages");
              router.refresh();
            })
          }
        >
          Archive
        </button>
      )}
      <a className="btn-primary" href={replyHref}>
        Reply by email
      </a>
    </div>
  );
}
