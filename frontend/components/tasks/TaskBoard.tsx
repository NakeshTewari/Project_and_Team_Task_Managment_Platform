"use client";

import { TaskWithDetails, TaskStatus } from "../../types/task";
import TaskCard from "./TaskCard";

interface TaskBoardProps {
  tasks: TaskWithDetails[];
  canEdit: boolean;
  currentUserId: number;
  currentUserRole: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
  onEdit: (task: TaskWithDetails) => void;
  onProgressChange: (id: number, status: TaskStatus) => void;
  onDelete?: (id: number) => void;
}

const columns: { status: TaskStatus; label: string }[] = [
  { status: "TODO", label: "To do" },
  { status: "IN_PROGRESS", label: "In progress" },
  { status: "IN_REVIEW", label: "In review" },
  { status: "DONE", label: "Done" },
];

export default function TaskBoard({
  tasks,
  canEdit,
  currentUserId,
  currentUserRole,
  onEdit,
  onProgressChange,
  onDelete,
}: TaskBoardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div key={col.status} className="bg-surface-muted rounded-lg p-3">
            <h3 className="text-sm font-medium mb-3 flex justify-between">
              {col.label}
              <span className="text-foreground-muted">{columnTasks.length}</span>
            </h3>
            <div className="space-y-3">
              {columnTasks.map((task) => {
                const canUpdateProgress =
                  currentUserRole !== "TEAM_MEMBER" || task.assigned_to_id === currentUserId;
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    canEdit={canEdit}
                    canUpdateProgress={canUpdateProgress}
                    onEdit={onEdit}
                    onProgressChange={onProgressChange}
                    onDelete={onDelete}
                  />
                );
              })}
              {columnTasks.length === 0 && (
                <p className="text-xs text-foreground-muted">No tasks</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}