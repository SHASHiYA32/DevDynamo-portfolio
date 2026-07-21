"use client";

import TaskAdminView from "@/components/tasks/TaskAdminView";
import TaskUserView from "@/components/tasks/TaskUserView";
import { useUserRole } from "@/lib/hook/user";

export default function TaskPage() {
  const { role, loading } = useUserRole();
  const ADMIN_ROLE_ID = 1;

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {role === ADMIN_ROLE_ID ? (
        <TaskAdminView />
      ) : (
        <TaskUserView />
      )}
    </div>
  );
}