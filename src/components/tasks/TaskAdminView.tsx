"use client";

import { fetchTasks } from "@/app/actions/taskService";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  FolderKanban,
  User,
  ListTodo,
  AlertCircle,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: number;
  task_name: string;
  progress: string;
  project_id: number;
  user_profile_id: string;
  status: string;

  user_profiles?: {
    full_name: string;
  } | null;

  projects?: {
    project_name: string;
  } | null;
}

export default function TaskAdminView() {
  const supabase = createClient();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [inactiveOpen, setInactiveOpen] = useState(false);

  const [projects, setProjects] = useState<
    { id: number; project_name: string | null }[]
  >([]);

  const [employees, setEmployees] = useState<
    { id: number; full_name: string | null }[]
  >([]);

  const [taskData, setTaskData] = useState<{
    task_name: string;
    project_id: string;
    user_profile_id: string;
  }>({
    task_name: "",
    project_id: "",
    user_profile_id: "",
  });
  const [inactiveTasks, setInactiveTasks] = useState<Task[]>([]);

  const [filters, setFilters] = useState({
    progress: "",
    projectId: "",
    userProfileId: "",
  });

  const fetchTaskOptions = async () => {
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id, project_name")
      .order("created_at", {
        ascending: false,
      });

    const { data: employeeData, error: employeeError } = await supabase
      .from("user_profiles")
      .select("id, full_name, email")
      .order("created_at", {
        ascending: false,
      });

    if (projectError) {
      console.error(projectError);
    }

    if (employeeError) {
      console.error(employeeError);
    }

    setProjects(projectData || []);
    setEmployees(employeeData || []);
  };

  const loadTasks = async () => {
    setLoading(true);
    const { data, error } = await fetchTasks(filters, true);

    if (error) {
      console.error(error);
    }

    setTasks((data as Task[]) || []);
    setLoading(false);
  };

  const handleCreateTask = async () => {
    const { error } = await supabase.from("tasks").insert([
      {
        task_name: taskData.task_name,
        project_id: taskData.project_id ? taskData.project_id : null,
        user_profile_id: taskData.user_profile_id
          ? taskData.user_profile_id
          : null,
        progress: "in-progress",
        status: "active",
      },
    ]);

    if (error) {
      console.error("Error creating task:", error);
    } else {
      setOpen(false);
      setTaskData({ task_name: "", project_id: "", user_profile_id: "" });
      loadTasks();
    }
  };

  const fetchInactiveTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
      *,
      projects:project_id (
        id,
        project_name
      ),
      user_profiles:user_profile_id (
        id,
        full_name
      )
    `,
      )
      .eq("status", "inactive");

    if (error) {
      console.log("error in fetching inactive tasks", error);
    } else {
      setInactiveTasks((data as Task[]) || []);
    }
  };

  const handleRestoreTask = async (taskId: number) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: "active" })
      .eq("id", taskId);

    if (error) {
      console.error("Error restoring task:", error);
      toast.custom(() => (
        <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Action Failed
            </span>
            <span className="text-xs text-zinc-400">
              Could not restore task.
            </span>
          </div>
        </div>
      ));
    } else {
      toast.custom(() => (
        <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-inner">
            <RotateCcw className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Task Restored
            </span>
            <span className="text-xs text-zinc-400">
              Task moved back to active.
            </span>
          </div>
        </div>
      ));
      fetchInactiveTasks();
      loadTasks();
    }
  };

  const handleDeletePermanently = async (taskId: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      toast.custom(() => (
        <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Action Failed
            </span>
            <span className="text-xs text-zinc-400">
              Could not delete task.
            </span>
          </div>
        </div>
      ));
    } else {
      toast.custom(() => (
        <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-inner">
            <Trash2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Task Deleted
            </span>
            <span className="text-xs text-zinc-400">
              Task permanently removed.
            </span>
          </div>
        </div>
      ));
      fetchInactiveTasks();
    }
  };

  useEffect(() => {
    fetchTaskOptions();
    fetchInactiveTasks();
  }, []);

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 p-4 sm:p-6 overflow-x-hidden mt-13 sm:mt-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Task Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage projects, employees and task progress
          </p>
        </div>

        <Button
          onClick={() => {
            setOpen(true);
            fetchTaskOptions();
          }}
          className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary/70 shadow-lg hover:scale-105 transition"
        >
          <Plus size={18} />
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="border bg-gradient-to-br from-background to-muted/40">
          <CardContent className="p-4 sm:p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <ListTodo className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Total Tasks
              </p>
              <h2 className="text-xl sm:text-2xl font-bold">{tasks.length}</h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <FolderKanban className="text-blue-500 h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Projects
              </p>
              <h2 className="text-xl sm:text-2xl font-bold">
                {projects.length || "--"}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 md:col-span-1">
          <CardContent className="p-4 sm:p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <User className="text-green-500 h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Members
              </p>
              <h2 className="text-xl sm:text-2xl font-bold">
                {employees.length || "--"}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="backdrop-blur-xl bg-background/70">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Filters</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <Select
              value={filters.progress || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  progress: value === "all" ? "" : String(value),
                }))
              }
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Filter progress" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Progress</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={loadTasks}
              className="w-full sm:w-auto"
            >
              Apply Filters
            </Button>
          </div>

          <Button
            onClick={() => {
              fetchInactiveTasks();
              setInactiveOpen(true);
            }}
            className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary/70 shadow-lg hover:scale-105 transition"
          >
            Inactive Tasks ({inactiveTasks.length})
          </Button>
        </CardContent>
      </Card>

      {/* Tasks Table / Card layout for mobile */}
      <Card className="overflow-hidden shadow-xl border">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Tasks</CardTitle>
        </CardHeader>

        <CardContent className="p-0 sm:p-6 sm:pt-0">
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4 font-semibold">Task</th>
                  <th className="p-4 font-semibold">Employee</th>
                  <th className="p-4 font-semibold">Project</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border text-sm">
                {tasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center p-10 text-muted-foreground"
                    >
                      No tasks found
                    </td>
                  </tr>
                )}

                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-muted/50 transition">
                    <td className="p-4 font-medium max-w-[200px] truncate">
                      {task.task_name}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {task.user_profiles?.full_name ?? "Unassigned"}
                    </td>
                    <td className="p-4 text-muted-foreground max-w-[200px] truncate">
                      {task.projects?.project_name || "No Project"}
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          task.progress === "complete"
                            ? "bg-green-500/15 text-green-600 hover:bg-green-500/20"
                            : "bg-blue-500/15 text-blue-600 hover:bg-blue-500/20"
                        }
                      >
                        {task.progress}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-3 md:hidden p-4 pt-0">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">
                No tasks found
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-3 p-4 rounded-xl border bg-card shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm leading-snug">
                      {task.task_name}
                    </h4>
                    <Badge
                      className={
                        task.progress === "complete"
                          ? "bg-green-500/15 text-green-600 shrink-0"
                          : "bg-blue-500/15 text-blue-600 shrink-0"
                      }
                    >
                      {task.progress}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium text-foreground">
                        Project:
                      </span>{" "}
                      {task.projects?.project_name || "No Project"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Assigned:
                      </span>{" "}
                      {task.user_profiles?.full_name ?? "Unassigned"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-[500px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Task Name</Label>
              <Input
                placeholder="Fix employee dashboard bugs"
                value={taskData.task_name}
                onChange={(e) =>
                  setTaskData({ ...taskData, task_name: e.target.value })
                }
              />
            </div>

            {/* Select Project */}
            <div className="space-y-2">
              <Label>Select Project</Label>
              <Select
                value={taskData.project_id}
                onValueChange={(value) =>
                  setTaskData({
                    ...taskData,
                    project_id: value ?? "",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose project">
                    {projects.find((p) => String(p.id) === taskData.project_id)
                      ?.project_name || "Choose project"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.project_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assign Employee */}
            <div className="space-y-2">
              <Label>Assign Employee</Label>
              <Select
                value={taskData.user_profile_id}
                onValueChange={(value) =>
                  setTaskData({
                    ...taskData,
                    user_profile_id: value ?? "",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose employee">
                    {employees.find(
                      (e) => String(e.id) === taskData.user_profile_id,
                    )?.full_name || "Choose employee"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={String(employee.id)}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreateTask}
              className="w-full mt-2 bg-gradient-to-r from-primary to-primary/70"
            >
              Create Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inactive Tasks Dialog */}
      <Dialog open={inactiveOpen} onOpenChange={setInactiveOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Inactive Tasks</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {inactiveTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">
                No inactive tasks found.
              </p>
            ) : (
              inactiveTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border bg-muted/40"
                >
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="font-semibold text-sm truncate">
                      {task.task_name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      Project: {task.projects?.project_name || "No Project"} |
                      Assigned: {task.user_profiles?.full_name || "Unassigned"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestoreTask(task.id)}
                      className="gap-1 text-xs"
                    >
                      <RotateCcw size={14} />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePermanently(task.id)}
                      className="gap-1 text-xs"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
