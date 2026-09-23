import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export function isStaffRole(role: string | null | undefined) {
  return role === "staff" || role === "admin";
}

export const requireStaff = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
  const profile = data as { role?: string; full_name?: string | null } | null;

  if (!profile || !isStaffRole(profile.role)) {
    redirect("/dashboard");
  }

  return { user, role: profile.role as "staff" | "admin", fullName: profile.full_name ?? null };
});
