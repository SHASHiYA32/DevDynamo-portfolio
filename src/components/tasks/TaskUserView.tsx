"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  task_name: string;
  progress: string;
}

export default function TaskUserView() {
  const supabase = createClient();

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, task_name, progress");

    if (error) {
      console.error(error);
      return;
    }

    setTasks(data || []);
  };

  const updateProgress = async (id: number, newProgress: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ progress: newProgress })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, progress: newProgress } : task,
      ),
    );
  };

  return (
    <div>
      <h2>My Tasks</h2>

      {tasks.map((task) => (
        <div key={task.id}>
          <p>{task.task_name}</p>

          <select
            value={task.progress}
            onChange={(e) => updateProgress(task.id, e.target.value)}
          >
            <option value="in-progress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
        </div>
      ))}
    </div>
  );
}
