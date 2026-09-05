"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  const role = (profile as { role?: string } | null)?.role;

  revalidatePath("/", "layout");
  redirect(role === "staff" || role === "admin" ? "/admin" : "/questionnaire");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    const existing = await supabase.auth.signInWithPassword({ email, password });
    if (existing.data.session) {
      revalidatePath("/", "layout");
      redirect("/questionnaire");
    }
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.session && data.user) {
    try {
      const admin = createAdminClient();
      await admin.auth.admin.updateUserById(data.user.id, { email_confirm: true });
    } catch {
      // Service role not configured — password sign-in still works when
      // confirmations are disabled in the Supabase project.
    }

    const signedIn = await supabase.auth.signInWithPassword({ email, password });
    if (signedIn.error || !signedIn.data.session) {
      redirect(
        `/signup?error=${encodeURIComponent(signedIn.error?.message ?? "Could not sign you in. Try logging in.")}`
      );
    }
  }

  revalidatePath("/", "layout");
  redirect("/questionnaire");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
