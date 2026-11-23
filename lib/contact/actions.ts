"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitContactMessage(formData: FormData): Promise<ContactSubmitResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Please complete all fields before sending." };
  }
  if (name.length > 200) {
    return { ok: false, error: "Name is too long." };
  }
  if (!isValidEmail(email) || email.length > 320) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "Message is too long." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages" as never).insert({
    name,
    email,
    message,
    status: "new",
  } as never);

  if (error) {
    return {
      ok: false,
      error: "Could not send your message right now. Please try again or email us directly.",
    };
  }

  return { ok: true };
}
