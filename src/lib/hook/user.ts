"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function useUserRole() {
  const [role, setRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role_id")
          .eq("auth_id", user.id)
          .single();
        
        setRole(profile?.role_id || null);
      }
      setLoading(false);
    }
    fetchRole();
  }, [supabase]);

  return { role, loading };
}