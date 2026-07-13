"use client";

import Link from "next/link";
import { TaskWithDetails, TaskStatus } from "../../types/task";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

interface TaskCardProps {
  task: TaskWithDetails;
  canEdit: boolean;
  canUpdateProgress: boolean;
  onEdit: (task: TaskWithDetails) => void;
  onProgressChange: (id: number, status: TaskStatus) => void;
  onDelete?: (id: number) => void;
}

const nextStatusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

export default function TaskCard({
  task,
  canEdit,
  canUpdateProgress,
  onEdit,
  onProgressChange,
  onDelete,
}: TaskCardProps) {
  return (
    <div className="border border-border rounded-lg p-3 bg-surface space-y-2">
      <div className="flex justify-between items-start gap-2">
        <Link href={`/tasks/${task.id}`} className="text-sm font-medium hover:underline">
          {task.title}
        </Link>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="text-xs text-foreground-muted line-clamp-2">{task.description}</p>
      )}

      <div className="flex justify-between items-center text-xs text-foreground-muted">
        <span>{task.assigned_to_name ?? "Unassigned"}</span>
        {task.due_date && <span>{new Date(task.due_date).toLocaleDateString()}</span>}
      </div>

      <div className="flex justify-between items-center pt-1">
        <StatusBadge status={task.status} />
        <div className="space-x-2">
          {canEdit && (
            <button onClick={() => onEdit(task)} className="text-accent text-xs hover:underline">
              Edit
            </button>
          )}
          {canEdit && onDelete && (
            <button
              onClick={() => {
                if (confirm("Delete this task?")) onDelete(task.id);
              }}
              className="text-danger text-xs hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {canUpdateProgress && (
        <select
          value={task.status}
          onChange={(e) => onProgressChange(task.id, e.target.value as TaskStatus)}
          className="w-full text-xs border border-border rounded px-2 py-1"
        >
          {nextStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}