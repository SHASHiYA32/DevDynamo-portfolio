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
import { Plus, FolderKanban, User, ListTodo } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface Task {
  id: number;
  task_name: string;
  progress: string;
  project_id: number;
  user_profile_id: string;

  user_profiles?: {
    full_name: string;
  } | null;

  projects?: {
    project: string;
  } | null;
}

export default function TaskAdminView() {
  const supabase = createClient();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [projects, setProjects] = useState<
    { id: number; project: string | null }[]
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

  const [filters, setFilters] = useState({
    progress: "",
    projectId: "",
    userProfileId: "",
  });

  const fetchTaskOptions = async () => {
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id, project")
      .order("created_at", {
        ascending: false,
      });

    const { data: employeeData, error: employeeError } = await supabase
      .from("user_profiles")
      .select("id, full_name")
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
    console.log("TASK DATA:", data);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>

          <p className="text-muted-foreground">
            Manage projects, employees and task progress
          </p>
        </div>

        <Button
          onClick={() => {
            setOpen(true);
            fetchTaskOptions();
          }}
          className="
                gap-2
                bg-gradient-to-r 
                from-primary 
                to-primary/70
                shadow-lg
                hover:scale-105
                transition
            "
        >
          <Plus size={18} />
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border bg-gradient-to-br from-background to-muted/40">
          <CardContent className="p-6 flex items-center gap-4">
            <div
              className="
            p-3 rounded-xl 
            bg-primary/10
            "
            >
              <ListTodo className="text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>

              <h2 className="text-2xl font-bold">{tasks.length}</h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div
              className="
            p-3 rounded-xl 
            bg-blue-500/10
            "
            >
              <FolderKanban className="text-blue-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Projects</p>

              <h2 className="text-2xl font-bold">--</h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div
              className="
            p-3 rounded-xl 
            bg-green-500/10
            "
            >
              <User className="text-green-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Members</p>

              <h2 className="text-2xl font-bold">--</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-xl bg-background/70">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4 flex-wrap">
          <Select
            value={filters.progress || "all"}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                progress: value === "all" ? "" : String(value),
              }))
            }
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter progress" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Progress</SelectItem>

              <SelectItem value="in-progress">In Progress</SelectItem>

              <SelectItem value="complete">Complete</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={loadTasks}>
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Tasks Table */}

      <Card
        className="
      overflow-hidden
      shadow-xl
      border
      "
      >
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="p-4">Task</th>

                  <th>Employee</th>

                  <th>Project</th>

                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {tasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="
                    text-center
                    p-10
                    text-muted-foreground
                    "
                    >
                      No tasks found
                    </td>
                  </tr>
                )}

                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="
                  border-t
                  hover:bg-muted/50
                  transition
                  "
                  >
                    <td className="p-4 font-medium">{task.task_name}</td>

                    <td>{task.user_profiles?.full_name ?? "Unassigned"}</td>

                    <td>{task.projects?.project || "No Project"}</td>

                    <td>
                      <Badge
                        className={
                          task.progress === "complete"
                            ? "bg-green-500/15 text-green-600"
                            : "bg-blue-500/15 text-blue-600"
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
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Task Name</Label>

              <Input placeholder="Fix employee dashboard bugs" />
            </div>

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
                <SelectTrigger>
                  <SelectValue placeholder="Choose project" />
                </SelectTrigger>

                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                <SelectTrigger>
                  <SelectValue placeholder="Choose employee" />
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
              className="
        w-full
        bg-gradient-to-r
        from-primary
        to-primary/70
        "
            >
              Create Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
