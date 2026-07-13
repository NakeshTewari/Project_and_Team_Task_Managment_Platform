"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import UserTable from "../../../components/users/UserTable";
import UserFormModal from "../../../components/users/UserFormModal";
import { getUsers, createUser, updateUser, deleteUser } from "../../../lib/users";
import { User, Role } from "../../../types/auth";

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <UsersContent />
    </ProtectedRoute>
  );
}

function UsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    await deleteUser(id);
    await loadUsers();
  };

  const handleSubmit = async (data: { name: string; email: string; password?: string; role: Role }) => {
    if (editingUser) {
      await updateUser(editingUser.id, { name: data.name, email: data.email, role: data.role });
    } else {
      await createUser({
        name: data.name,
        email: data.email,
        password: data.password!,
        role: data.role,
      });
    }
    await loadUsers();
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Users</h1>
          <p className="text-sm text-foreground-muted mt-1">
            {loading ? "Loading..." : `${users.length} user${users.length === 1 ? "" : "s"} in your workspace`}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
        >
          + Add user
        </button>
      </div>

      {loading ? (
        <p className="text-foreground-muted text-sm">Loading users...</p>
      ) : (
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      )}

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingUser}
      />
    </div>
  );
}