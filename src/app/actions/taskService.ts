import { createClient } from "@/lib/supabase/client";

export async function fetchTasks(filters: any, isAdmin: boolean) {
  const supabase = createClient();

  let query = supabase.from("tasks").select(`
      *,
      projects!tasks_project_id_fkey(
      id,
      project
    )
    `);

  if (!isAdmin) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      query = query.eq("user_profile_id", user.id);
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
    console.error(error);
    return {
      data: null,
      error,
    };
  }

  const tasksWithProfiles = await Promise.all(
    (data || []).map(async (task) => {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select(
          `
          id,
          full_name
        `,
        )
        .eq("auth_id", task.user_profile_id)
        .single();

      return {
        ...task,
        user_profiles: profile,
      };
    }),
  );

  return {
    data: tasksWithProfiles,
    error: null,
  };
}
