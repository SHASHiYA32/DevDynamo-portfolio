"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  FolderKanban,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    totalProjects: 0,
    teamMembers: 0,
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        if (authError || !authData?.user) throw authError;

        const { data: userProfile, error: profileError } = await supabase
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
          .eq("auth_id", authData.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(userProfile);

        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select(
            `
            id,
            task_name,
            status,
            progress,
            created_at,
            project_id,
            projects ( id, project_name )
          `,
          )
          .eq("user_profile_id", userProfile.id)
          .order("created_at", { ascending: false });

        if (tasksError) throw tasksError;

        // Filter active tasks (status = 'active')
        const activeTasks = tasksData.filter(
          (t) => t.status?.toLowerCase() === "active",
        );

        const total = activeTasks.length;

        // Progress metrics based on active tasks
        const inProgress = activeTasks.filter(
          (t) =>
            t.progress?.toLowerCase() === "in-progress" ||
            t.progress?.toLowerCase() === "in progress",
        ).length;

        const completed = activeTasks.filter(
          (t) =>
            t.progress?.toLowerCase() === "complete" ||
            t.progress?.toLowerCase() === "completed",
        ).length;

        const { count: projectCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true });

        const { count: memberCount } = await supabase
          .from("user_profiles")
          .select("*", { count: "exact", head: true });

        setStats({
          totalTasks: total,
          inProgressTasks: inProgress,
          completedTasks: completed,
          totalProjects: projectCount || 0,
          teamMembers: memberCount || 0,
        });

        setRecentTasks(activeTasks.slice(0, 5));
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-muted-foreground">
        <div className="flex items-center gap-2 animate-pulse">
          <Clock className="w-5 h-5 animate-spin" />
          <span>Loading DevDynamo Overview...</span>
        </div>
      </div>
    );
  }

  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto text-slate-100">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {profile?.full_name || "Developer"} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here is what’s happening across DevDynamo engagements today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="px-3 py-1 bg-slate-900/50 border-slate-700 text-indigo-400"
          >
            Role: {profile?.role?.role || "Team Member"}
          </Badge>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Active Tasks
            </CardTitle>
            <ListTodo className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats.totalTasks}
            </div>
            <p className="text-xs text-slate-500 mt-1">Active items in queue</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              In Progress
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats.inProgressTasks}
            </div>
            <p className="text-xs text-slate-500 mt-1">Currently being built</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              Completed Tasks
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats.completedTasks}
            </div>
            <p className="text-xs text-slate-500 mt-1">Successfully shipped</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              Company Projects
            </CardTitle>
            <FolderKanban className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats.totalProjects}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active client/internal pipelines
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row: Progress & Team stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Completion Rate Widget */}
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm lg:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              Efficiency Overview
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your overall task completion ratio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Completion Rate</span>
                <span className="font-semibold text-emerald-400">
                  {completionRate}%
                </span>
              </div>
              <Progress value={completionRate} className="h-2 bg-slate-800" />
            </div>

            <div className="rounded-lg bg-slate-950/50 p-4 border border-slate-800/80 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-indigo-400 shrink-0" />
              <div className="text-xs text-slate-400">
                You have completed{" "}
                <span className="text-white font-medium">
                  {stats.completedTasks}
                </span>{" "}
                out of{" "}
                <span className="text-white font-medium">
                  {stats.totalTasks}
                </span>{" "}
                active tasks. Keep up the high velocity!
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Task Activity */}
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              Recent Task Stream
            </CardTitle>
            <CardDescription className="text-slate-400">
              Latest actions mapped to your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <div className="text-center py-10 text-slate-500 flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 stroke-1" />
                <p>No active tasks found in your pipeline.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => {
                  const isComplete =
                    task.progress?.toLowerCase() === "complete" ||
                    task.progress?.toLowerCase() === "completed";
                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1 truncate pr-4">
                        <div className="text-xs text-indigo-400 font-mono">
                          {task.projects?.project_name || "DevDynamo_internal"}
                        </div>
                        <div className="text-sm font-medium text-white truncate">
                          {task.task_name}
                        </div>
                      </div>
                      <div>
                        <Badge
                          variant={isComplete ? "default" : "secondary"}
                          className={`text-xs ${
                            isComplete
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {task.progress || "In-Progress"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
