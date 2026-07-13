"use client";

import { User } from "../../types/auth";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return <p className="text-foreground-muted">No users yet. Add one to get started.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-border text-left text-sm text-foreground-muted">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Email</th>
          <th className="py-2 pr-4">Role</th>
          <th className="py-2 pr-4">Joined</th>
          <th className="py-2 pr-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-border text-sm">
            <td className="py-2 pr-4">{user.name}</td>
            <td className="py-2 pr-4">{user.email}</td>
            <td className="py-2 pr-4">
              <RoleChip role={user.role} />
            </td>
            <td className="py-2 pr-4 text-foreground-muted">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
            </td>
            <td className="py-2 pr-4 space-x-3">
              <button onClick={() => onEdit(user)} className="text-accent hover:underline">
                Edit
              </button>
              <button onClick={() => onDelete(user.id)} className="text-danger hover:underline">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RoleChip({ role }: { role: User["role"] }) {
  const styles: Record<User["role"], string> = {
    ADMIN: "bg-role-admin-bg text-role-admin",
    PROJECT_MANAGER: "bg-role-pm-bg text-role-pm",
    TEAM_MEMBER: "bg-role-member-bg text-role-member",
  };
  const labels: Record<User["role"], string> = {
    ADMIN: "Admin",
    PROJECT_MANAGER: "Project Manager",
    TEAM_MEMBER: "Team Member",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${styles[role]}`}>
      {labels[role]}
    </span>
  );
}