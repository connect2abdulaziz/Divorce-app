"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin/current-staff";
import { createClient } from "@/lib/supabase/server";

export async function markContactMessageRead(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages" as never)
    .update({ status: "read" } as never)
    .eq("id", id)
    .eq("status", "new");
  if (error) throw error;
  revalidatePath("/admin/messages", "layout");
}

export async function archiveContactMessage(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages" as never)
    .update({ status: "archived" } as never)
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/messages", "layout");
}

export async function restoreContactMessage(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages" as never)
    .update({ status: "read" } as never)
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/messages", "layout");
}
