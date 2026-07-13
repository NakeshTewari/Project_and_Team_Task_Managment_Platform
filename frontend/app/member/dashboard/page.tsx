"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import TaskBoard from "../../../components/tasks/TaskBoard";
import { getTasks, updateProgress } from "../../../lib/tasks";
import { useAuth } from "../../../context/AuthContext";
import { TaskWithDetails, TaskStatus } from "../../../types/task";

export default function MemberDashboard() {
  return (
    <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>
      <MemberDashboardContent />
    </ProtectedRoute>
  );
}

function MemberDashboardContent() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    getTasks()
      .then(setTasks)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleProgressChange = async (id: number, status: TaskStatus) => {
    try {
      await updateProgress(id, status);
      await load();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  if (!user) return null;

  const dueSoon = tasks.filter(
    (t) => t.status !== "DONE" && t.due_date && new Date(t.due_date).getTime() - Date.now() < 3 * 86400000
  ).length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const done = tasks.filter((t) => t.status === "DONE").length;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-foreground-muted mt-1">Here&apos;s what&apos;s on your plate.</p>
      </div>

      {!loading && tasks.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-3 py-1.5 text-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-status-in-progress" />
            <span className="font-medium text-foreground">{inProgress}</span>
            <span className="text-foreground-muted">in progress</span>
          </div>
          <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-3 py-1.5 text-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-status-done" />
            <span className="font-medium text-foreground">{done}</span>
            <span className="text-foreground-muted">done</span>
          </div>
          {dueSoon > 0 && (
            <div className="flex items-center gap-2 bg-danger-bg border border-danger/20 rounded-full px-3 py-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-danger" />
              <span className="font-medium text-danger">{dueSoon}</span>
              <span className="text-danger">due soon</span>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-foreground-muted text-sm">Loading...</p>
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