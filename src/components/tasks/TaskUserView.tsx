"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListTodo, Trash2, FolderKanban, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: number;
  task_name: string;
  progress: string;
  status?: string;
  projects?:
    | {
        project_name: string | null;
      }
    | {
        project_name: string | null;
      }[]
    | null;
}

export default function TaskUserView() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Auth error or no user logged in:", userError);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching user profile:", profileError);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        id, 
        task_name, 
        progress,
        status,
        projects:project_id (
          project_name
        )
      `,
      )
      .eq("user_profile_id", profile.id)
      .neq("status", "inactive");

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks((data as Task[]) || []);
    }

    setLoading(false);
  };

  const updateProgress = async (id: number, newProgress: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ progress: newProgress })
      .eq("id", id);

    if (error) {
      console.error("Error updating progress:", error);
      toast.custom((t) => (
        <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,._3)] text-white">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">Update Failed</span>
            <span className="text-xs text-zinc-400">Could not update task progress.</span>
          </div>
        </div>
      ));
      return;
    }

    // Apple-style Dynamic Glass Toast
    toast.custom((t) => (
      <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white transition-all">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-inner">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">Progress Updated</span>
          <span className="text-xs text-zinc-400 capitalize">Changed to {newProgress.replace("-", " ")}</span>
        </div>
      </div>
    ));

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, progress: newProgress } : task,
      ),
    );
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: "inactive" })
      .eq("id", id);

    if (error) {
      console.error("Error setting task to inactive:", error);
      toast.custom((t) => (
        <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">Action Failed</span>
            <span className="text-xs text-zinc-400">Could not delete task.</span>
          </div>
        </div>
      ));
      return;
    }

    // Apple-style Dynamic Glass Toast for Deletion
    toast.custom((t) => (
      <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 shadow-inner">
          <Trash2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">Task Removed</span>
          <span className="text-xs text-zinc-400">Successfully archived item.</span>
        </div>
      </div>
    ));

    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Assigned Tasks
          </h1>
          <p className="text-muted-foreground">
            View and manage your current responsibilities and progress status.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg text-sm font-medium">
          <ListTodo className="h-4 w-4 text-primary" />
          <span>Total: {tasks.length}</span>
        </div>
      </div>

      {/* Task List Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading your tasks...
        </div>
      ) : tasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ListTodo className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-lg font-medium">No tasks assigned</p>
            <p className="text-sm text-muted-foreground">
              You currently have no tasks assigned to your profile.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => {
            const projectName = Array.isArray(task.projects)
              ? task.projects[0]?.project_name
              : task.projects?.project_name;

            return (
              <Card
                key={task.id}
                className="transition-all hover:shadow-md border"
              >
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Task details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {projectName && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold">
                          <FolderKanban className="h-3 w-3" />
                          {projectName}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{task.task_name}</h3>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className="w-[160px]">
                      <Select
                        value={task.progress}
                        onValueChange={(value) => {
                          if (value) {
                            updateProgress(task.id, value);
                          }
                        }}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="complete">Complete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}