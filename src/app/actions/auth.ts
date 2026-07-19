"use server";

import { adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/client";

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
      },
    ]);

  if (profileError) {
    console.error("Profile Insert Error:", profileError);
    return { error: `Profile failed: ${profileError.message}` };
  }

  return { success: true };
}

export async function checkTemporaryPassword() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      error: "Not authenticated",
    };
  }

  const { data: profile, error: profileError } = await adminClient
    .from("user_profiles")
    .select("tempory_psw")
    .eq("auth_id", user.id)
    .single();

  if (profileError) {
    return {
      error: profileError.message,
    };
  }

  return {
    hasTemporaryPassword: !!profile.tempory_psw,
  };
}

export async function updateNewPassword(password: string) {
  const supabase = await createClient();

  // 1. Get the user from the current session
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  // If this fails, try getting the user from the session explicitly
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = user?.id || session?.user.id;

  if (!currentUserId) {
    return { error: "You are not logged in." };
  }

  // 2. Perform the update using the admin client
  const { error: authError } = await adminClient.auth.admin.updateUserById(
    currentUserId,
    { password: password }
  );

  if (authError) return { error: authError.message };

  // 3. Clear the temporary password in your profile table
  const { error: profileError } = await adminClient
    .from("user_profiles")
    .update({ tempory_psw: null })
    .eq("auth_id", currentUserId);

  if (profileError) return { error: "Failed to clear temporary status." };

  return { success: true };
}