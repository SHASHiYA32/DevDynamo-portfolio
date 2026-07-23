import { createClient } from "@/lib/supabase/client";

export async function fetchTasks(filters: any, isAdmin: boolean) {
  const supabase = createClient();

  let query = supabase
  .from("tasks")
  .select(`
      *,
      projects:project_id (
        id,
        project_name
      ),
      user_profiles:user_profile_id (
        id,
        full_name
      )
    `)
    .neq("status", "inactive")

  if (!isAdmin) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select(
          `
          id,
          full_name,
          role:role_id (
            role
          )
        `,
        )
        .eq("auth_id", user.id)
        .single();

      const roleData = profile?.role as any;
      const roleName = Array.isArray(roleData)
        ? roleData[0]?.role
        : roleData?.role;

      if (roleName !== "admin") {
        query = query.eq("user_profile_id", profile?.id);
      }
    }
  }

  if (filters.progress) {
    query = query.eq("progress", filters.progress);
  }

  if (filters.projectId) {
    query = query.eq("project_id", filters.projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tasks:", error);
    return { data: null, error };
  }

  return { data, error: null };
}
