"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const UNREACHABLE =
  "Cannot reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL in .env.local (project may be paused or deleted).";

function isAuthUnreachable(error: { name?: string; message?: string } | null | undefined) {
  if (!error) return false;
  return (
    error.name === "AuthRetryableFetchError" ||
    (error.message ?? "").toLowerCase().includes("fetch failed")
  );
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  // Only wrap the network call — never catch redirect(), which throws NEXT_REDIRECT.
  let result;
  try {
    result = await supabase.auth.signInWithPassword({ email, password });
  } catch (err) {
    const message =
      err instanceof Error && err.message.toLowerCase().includes("fetch")
        ? UNREACHABLE
        : err instanceof Error
          ? err.message
          : "Sign in failed.";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  if (result.error) {
    redirect(
      `/login?error=${encodeURIComponent(
        isAuthUnreachable(result.error) ? UNREACHABLE : result.error.message
      )}`
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", result.data.user.id)
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

  let result;
  try {
    result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
  } catch (err) {
    const message =
      err instanceof Error && err.message.toLowerCase().includes("fetch")
        ? UNREACHABLE
        : err instanceof Error
          ? err.message
          : "Sign up failed.";
    redirect(`/signup?error=${encodeURIComponent(message)}`);
  }

  if (result.error) {
    if (isAuthUnreachable(result.error)) {
      redirect(`/signup?error=${encodeURIComponent(UNREACHABLE)}`);
    }

    const existing = await supabase.auth.signInWithPassword({ email, password });
    if (existing.data.session) {
      revalidatePath("/", "layout");
      redirect("/questionnaire");
    }
    redirect(`/signup?error=${encodeURIComponent(result.error.message)}`);
  }

  const data = result.data;

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
        `/signup?error=${encodeURIComponent(
          signedIn.error?.message ?? "Could not sign you in. Try logging in."
        )}`
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
  redirect("/");
}
