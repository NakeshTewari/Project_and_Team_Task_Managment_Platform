"use client";

import { useState, FormEvent, useEffect } from "react";
import { getUsers } from "../../lib/users";
import { User } from "../../types/auth";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: number, roleInProject: string) => Promise<void>;
  existingMemberIds: number[]; // to exclude already-added users
}

export default function AddMemberModal({
  isOpen,
  onClose,
  onSubmit,
  existingMemberIds,
}: AddMemberModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [roleInProject, setRoleInProject] = useState("CONTRIBUTOR");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Admin-only endpoint — if a PM needs this too, add a lighter
      // GET /users/assignable route rather than opening /users to PMs
      getUsers().then(setUsers).catch(() => setUsers([]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const availableUsers = users.filter((u) => !existingMemberIds.includes(u.id));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedUserId) {
      setError("Select a user to add");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(Number(selectedUserId), roleInProject);
      setSelectedUserId("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add member</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">User</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : "")}
              className="w-full border border-border rounded px-3 py-2"
            >
              <option value="">Select a user...</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Role in project</label>
            <select
              value={roleInProject}
              onChange={(e) => setRoleInProject(e.target.value)}
              className="w-full border border-border rounded px-3 py-2"
            >
              <option value="LEAD">Lead</option>
              <option value="CONTRIBUTOR">Contributor</option>
            </select>
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-border">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded bg-accent hover:bg-accent-hover text-white"
            >
              {submitting ? "Adding..." : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}