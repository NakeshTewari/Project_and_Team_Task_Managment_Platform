"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import TaskBoard from "../../../../components/tasks/TaskBoard";
import TaskForm from "../../../../components/tasks/TaskForm";
import {
  getTasks,
  createTask,
  updateTask,
  updateProgress,
  deleteTask,
} from "../../../../lib/tasks";
import { getProject } from "../../../../lib/projects";
import { useAuth } from "../../../../context/AuthContext";
import { TaskWithDetails, TaskStatus, TaskPriority } from "../../../../types/task";
import { Project } from "../../../../types/project";

export default function ProjectTasksPage() {
  return (
    <ProtectedRoute>
      <ProjectTasksContent />
    </ProtectedRoute>
  );
}

const boardColors = [
  "linear-gradient(135deg, #0C66E4, #0747A6)",
  "linear-gradient(135deg, #6E5DC6, #4A3B96)",
  "linear-gradient(135deg, #1F845A, #164B35)",
  "linear-gradient(135deg, #C9372C, #8B241C)",
  "linear-gradient(135deg, #B38600, #7A5900)",
];

function colorForProject(id: number) {
  return boardColors[id % boardColors.length];
}

function ProjectTasksContent() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithDetails | null>(null);

  const canManage = user?.role === "ADMIN" || user?.role === "PROJECT_MANAGER";

  const load = useCallback(async () => {
    setLoading(true);
    const [projectData, taskData] = await Promise.all([
      getProject(projectId),
      getTasks(projectId),
    ]);
    setProject(projectData);
    setTasks(taskData);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleProgressChange = async (taskId: number, status: TaskStatus) => {
    await updateProgress(taskId, status);
    await load();
  };

  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);
    await load();
  };

  const handleCreateOrEdit = async (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    assignedToId: number | null;
  }) => {
    if (editingTask) {
      await updateTask(editingTask.id, { ...data, status: editingTask.status });
    } else {
      await createTask({ ...data, projectId });
    }
    setFormOpen(false);
    setEditingTask(null);
    await load();
  };

  if (!user) return null;

  return (
    <div>
      <div className="px-6 py-4" style={{ background: colorForProject(projectId) }}>
        <div className="max-w-6xl mx-auto">
          <Link
            href={`/projects/${projectId}`}
            className="text-white/80 text-xs hover:text-white hover:underline"
          >
            ← {project ? project.name : "Back to project"}
          </Link>
          <div className="flex justify-between items-center mt-1">
            <h1 className="text-white text-xl font-semibold">Board</h1>
            {canManage && (
              <button
                onClick={() => {
                  setEditingTask(null);
                  setFormOpen(true);
                }}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-white text-foreground hover:bg-white/90 transition-colors shadow-sm"
              >
                + New task
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {formOpen && (
          <div className="mb-6 bg-surface border border-border rounded-lg p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              {editingTask ? "Edit task" : "New task"}
            </h2>
            <TaskForm
              projectId={projectId}
              initialData={editingTask}
              onSubmit={handleCreateOrEdit}
              onCancel={() => {
                setFormOpen(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        {loading ? (
          <p className="text-foreground-muted text-sm">Loading tasks...</p>
        ) : (
          <TaskBoard
            tasks={tasks}
            canEdit={canManage}
            currentUserId={user.id}
            currentUserRole={user.role}
            onEdit={(task) => {
              setEditingTask(task);
              setFormOpen(true);
            }}
            onProgressChange={handleProgressChange}
            onDelete={canManage ? handleDelete : undefined}
          />
        )}
      </div>
    </div>
  );
}