"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

export async function loginUser(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  const { data: profile, error: profileError } = await adminClient
    .from("user_profiles")
    .select("tempory_psw")
    .eq("auth_id", data.user.id)
    .single();

  if (profileError) {
    return {
      error: profileError.message,
    };
  }

  return {
    success: true,
    temporary: !!profile?.tempory_psw,
  };
}
