"use server"

import { adminClient } from "@/lib/supabase/admin";

export async function getRoles() {
  const { data, error } = await adminClient.from("role").select("id, role");
  if (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
  return data;
}