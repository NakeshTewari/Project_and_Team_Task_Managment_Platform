"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import TaskBoard from "../../components/tasks/TaskBoard";
import { getTasks, updateProgress } from "../../lib/tasks";
import { useAuth } from "../../context/AuthContext";
import { TaskWithDetails, TaskStatus } from "../../types/task";

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <TasksContent />
    </ProtectedRoute>
  );
}

function TasksContent() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await getTasks();
    setTasks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleProgressChange = async (id: number, status: TaskStatus) => {
    await updateProgress(id, status);
    await load();
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-xl font-semibold mb-6">
        {user.role === "TEAM_MEMBER" ? "My tasks" : "All tasks"}
      </h1>
      {loading ? (
        <p className="text-foreground-muted">Loading tasks...</p>
      ) : (
        <TaskBoard
          tasks={tasks}
          canEdit={false}
          currentUserId={user.id}
          currentUserRole={user.role}
          onEdit={() => {}}
          onProgressChange={handleProgressChange}
        />
      )}
    </div>
  );
}