"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ListTodo,
  Trash2,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Clock,
  CheckCircle,
  ThumbsUp,
} from "lucide-react";
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

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

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
      toast.custom(() => (
        <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-xl text-white">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Update Failed
            </span>
            <span className="text-xs text-zinc-400">
              Could not update task progress.
            </span>
          </div>
        </div>
      ));
      return;
    }

    toast.custom(() => (
      <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-xl text-white">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Progress Updated
          </span>
          <span className="text-xs text-zinc-400 capitalize">
            Changed to {newProgress.replace("-", " ")}
          </span>
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
      toast.custom(() => (
        <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-xl text-white">
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
      return;
    }

    toast.custom(() => (
      <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-xl text-white">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
          <Trash2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Task Removed
          </span>
          <span className="text-xs text-zinc-400">
            Successfully archived item.
          </span>
        </div>
      </div>
    ));

    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Helper to extract project name safely
  const getProjectName = (task: Task) => {
    return Array.isArray(task.projects)
      ? task.projects[0]?.project_name
      : task.projects?.project_name;
  };

  // Unique project list for dropdown filter
  const uniqueProjects = useMemo(() => {
    const projectsSet = new Set<string>();
    tasks.forEach((task) => {
      const pName = getProjectName(task);
      if (pName) projectsSet.add(pName);
    });
    return Array.from(projectsSet);
  }, [tasks]);

  // Filtered tasks computation
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const projectName = getProjectName(task) || "";
      const matchesSearch =
        task.task_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        projectName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProject =
        selectedProject === "all" || projectName === selectedProject;

      const matchesStatus =
        selectedStatus === "all" || task.progress === selectedStatus;

      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [tasks, searchQuery, selectedProject, selectedStatus]);

  // Statistics calculations
  const totalTasksCount = tasks.length;
  const inProgressCount = tasks.filter(
    (t) => t.progress === "in-progress",
  ).length;
  const completedCount = tasks.filter((t) => t.progress === "complete").length;
  const onTimeRate =
    totalTasksCount > 0
      ? Math.round((completedCount / totalTasksCount) * 100)
      : 100;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedProject("all");
    setSelectedStatus("all");
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 max-w-5xl mx-auto mt-13 sm:mt-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Assigned Tasks
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage your current responsibilities and progress status.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-muted text-foreground">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Tasks
              </p>
              <h3 className="text-2xl font-bold">{totalTasksCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                In Progress
              </p>
              <h3 className="text-2xl font-bold">{inProgressCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Completed
              </p>
              <h3 className="text-2xl font-bold">{completedCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <ThumbsUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                On-Time Rate
              </p>
              <h3 className="text-2xl font-bold">{onTimeRate}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card className="border shadow-sm">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4 text-primary" />
              <span>Filter Your Task Logs</span>
            </div>
            {(searchQuery ||
              selectedProject !== "all" ||
              selectedStatus !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-primary h-auto p-0 hover:bg-transparent hover:underline"
              >
                Clear All Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Search Keywords */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Search className="h-3 w-3" /> Search Keywords
              </label>
              <Input
                placeholder="Search task, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full"
              />
            </div>

            {/* Project Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <FolderKanban className="h-3 w-3" /> Project / Engagement
              </label>
              <Select
                value={selectedProject}
                onValueChange={(value) => {
                  if (value !== null) setSelectedProject(value);
                }}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {uniqueProjects.map((proj) => (
                    <SelectItem key={proj} value={proj}>
                      {proj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" /> Task Status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  if (value !== null) setSelectedStatus(value);
                }}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm sm:text-base">
          Loading your tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center px-4">
            <ListTodo className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-base sm:text-lg font-medium">No tasks found</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Try adjusting your filters or search criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filteredTasks.map((task) => {
            const projectName = getProjectName(task);

            return (
              <Card
                key={task.id}
                className="transition-all hover:shadow-md border"
              >
                <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Task details */}
                  <div className="space-y-1.5 flex-1 w-full min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {projectName && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold">
                          <FolderKanban className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">
                            {projectName}
                          </span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg break-words">
                      {task.task_name}
                    </h3>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-border">
                    <div className="flex-1 sm:flex-initial sm:w-[160px]">
                      <Select
                        value={task.progress}
                        onValueChange={(value) => {
                          if (value) {
                            updateProgress(task.id, value);
                          }
                        }}
                      >
                        <SelectTrigger className="h-9 w-full">
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
                      className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
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
