import { DashboardChrome } from "@/components/dashboard/DashboardChrome";
import { isStaffRole } from "@/lib/admin/current-staff";
import { getCurrentUser } from "@/lib/questionnaire/current-case";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import "./dashboard.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (isStaffRole((profile as { role?: string } | null)?.role)) {
    redirect("/admin");
  }

  return (
    <DashboardChrome userEmail={user.email ?? ""}>{children}</DashboardChrome>
  );
}