"use client";

import { SubmitButton } from "@/components/ui/SubmitButton";
import { signOut } from "@/app/auth/actions";

export function SignOutButton({ className = "btn-text" }: { className?: string }) {
  return (
    <form action={signOut}>
      <SubmitButton className={className} pendingLabel="Signing out…">
        Sign out
      </SubmitButton>
    </form>
  );
}
