"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../../../components/ProtectedRoute";
import StatusBadge from "../../../components/tasks/StatusBadge";
import PriorityBadge from "../../../components/tasks/PriorityBadge";
import CommentList from "../../../components/tasks/CommentList";
import CommentForm from "../../../components/tasks/CommentForm";
import { getTasks, deleteTask, updateProgress } from "../../../lib/tasks";
import { getComments, addComment } from "../../../lib/comments";
import { useAuth } from "../../../context/AuthContext";
import { TaskWithDetails, TaskStatus, TaskCommentWithUser } from "../../../types/task";

export default function TaskDetailPage() {
  return (
    <ProtectedRoute>
      <TaskDetailContent />
    </ProtectedRoute>
  );
}

const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

function TaskDetailContent() {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const router = useRouter();
  const { user } = useAuth();

  const [task, setTask] = useState<TaskWithDetails | null>(null);
  const [comments, setComments] = useState<TaskCommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const canManage = user?.role === "ADMIN" || user?.role === "PROJECT_MANAGER";
  const canUpdateProgress = task ? canManage || task.assigned_to_id === user?.id : false;

  const load = useCallback(async () => {
    setLoading(true);
    const [commentData, allTasks] = await Promise.all([getComments(taskId), getTasks()]);
    setComments(commentData);
    setTask(allTasks.find((t) => t.id === taskId) ?? null);
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleProgressChange = async (status: TaskStatus) => {
    await updateProgress(taskId, status);
    await load();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    await deleteTask(taskId);
    router.push(task ? `/projects/${task.project_id}/tasks` : "/tasks");
  };

  const handleAddComment = async (content: string) => {
    await addComment({ taskId, content });
    setComments(await getComments(taskId));
  };

  if (loading) {
    return <p className="max-w-2xl mx-auto py-10 px-4 text-foreground-muted">Loading...</p>;
  }

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <p>Task not found, or you don&apos;t have access to it.</p>
        <Link href="/tasks" className="text-accent hover:underline text-sm">
          ← Back to tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <Link href={`/projects/${task.project_id}/tasks`} className="text-accent text-sm hover:underline">
        ← Back to {task.project_name}
      </Link>

      <div>
        <div className="flex justify-between items-start gap-3 mb-2">
          <h1 className="text-xl font-semibold">{task.title}</h1>
          <PriorityBadge priority={task.priority} />
        </div>

        {task.description && <p className="text-foreground-muted mb-3">{task.description}</p>}

        <div className="flex flex-wrap gap-4 text-sm text-foreground-muted mb-4">
          <span>Assignee: {task.assigned_to_name ?? "Unassigned"}</span>
          {task.due_date && <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>}
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={task.status} />
          {canManage && (
            <button onClick={handleDelete} className="text-danger text-sm hover:underline">
              Delete task
            </button>
          )}
        </div>

        {canUpdateProgress && (
          <div className="mt-3">
            <label className="block text-sm mb-1">Update status</label>
            <select
              value={task.status}
              onChange={(e) => handleProgressChange(e.target.value as TaskStatus)}
              className="border border-border rounded px-3 py-2 text-sm"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-medium mb-3">Comments ({comments.length})</h2>
        <div className="mb-4">
          <CommentList comments={comments} />
        </div>
        <CommentForm onSubmit={handleAddComment} />
      </div>
    </div>
  );
}