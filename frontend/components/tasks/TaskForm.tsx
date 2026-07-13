"use client";

import { useState, FormEvent, useEffect } from "react";
import { TaskWithDetails, TaskPriority } from "../../types/task";
import { getMembers } from "../../lib/members";
import { ProjectMemberWithUser } from "../../types/project";

interface TaskFormProps {
  projectId: number;
  initialData?: TaskWithDetails | null;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    assignedToId: number | null;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function TaskForm({ projectId, initialData, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority ?? "MEDIUM");
  const [dueDate, setDueDate] = useState(initialData?.due_date?.slice(0, 10) ?? "");
  const [assignedToId, setAssignedToId] = useState<number | "">(initialData?.assigned_to_id ?? "");
  const [members, setMembers] = useState<ProjectMemberWithUser[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMembers(projectId).then(setMembers).catch(() => setMembers([]));
  }, [projectId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        dueDate,
        assignedToId: assignedToId === "" ? null : Number(assignedToId),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-border rounded px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full border border-border rounded px-3 py-2"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Assign to</label>
        <select
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value ? Number(e.target.value) : "")}
          className="w-full border border-border rounded px-3 py-2"
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.user_id} value={m.user_id}>
              {m.user_name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-danger text-sm">{error}</p>}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-accent hover:bg-accent-hover text-white"
        >
          {submitting ? "Saving..." : initialData ? "Save changes" : "Create task"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border border-border">
          Cancel
        </button>
      </div>
    </form>
  );
}