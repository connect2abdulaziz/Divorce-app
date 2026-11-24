"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** True when Supabase has a valid browser session (logged-in client or staff). */
export function useMarketingSession() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(Boolean(data.session));
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session));
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isAuthed, ready };
}