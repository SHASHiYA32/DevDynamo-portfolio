"use server";

import { adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function createEmployee(data: any) {
  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

  if (authError) return { error: authError.message };

  const { error: profileError } = await adminClient
    .from("user_profiles")
    .insert([
      {
        full_name: data.full_name,
        tempory_psw: data.password,
        auth_id: authData.user.id,
        role_id: data.role_id,
        phone: data.phone,
      },
    ]);

  if (profileError) {
    console.error("Profile Insert Error:", profileError);
    return { error: `Profile failed: ${profileError.message}` };
  }

  return { success: true };
}

export async function updateNewPassword(password: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You are not logged in." };
  }

  const { error: authError } = await adminClient.auth.admin.updateUserById(
    user.id,
    { password: password },
  );

  console.log("DEBUG: Current User ID:", user?.id);

  if (authError) return { error: authError.message };

  const { error: profileError } = await adminClient
    .from("user_profiles")
    .update({ tempory_psw: null })
    .eq("auth_id", user.id);

  if (profileError) return { error: "Failed to clear temporary status." };

  return { success: true };
}
