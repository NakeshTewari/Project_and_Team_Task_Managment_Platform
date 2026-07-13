"use client";

import { useState, FormEvent } from "react";
import { Project, ProjectStatus } from "../../types/project";

interface ProjectFormProps {
  initialData?: Project | null; // present = edit mode
  onSubmit: (data: { name: string; description: string; status: ProjectStatus }) => Promise<void>;
  onCancel?: () => void;
}

export default function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(initialData?.status ?? "PLANNED");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ name, description, status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm mb-1">Project name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          className="w-full border border-border rounded px-3 py-2"
        >
          <option value="PLANNED">Planned</option>
          <option value="ACTIVE">Active</option>
          <option value="ON_HOLD">On hold</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      {error && <p className="text-danger text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-accent hover:bg-accent-hover text-white"
        >
          {submitting ? "Saving..." : initialData ? "Save changes" : "Create project"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border border-border">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}