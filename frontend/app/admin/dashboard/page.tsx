"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";
import { getUsers } from "../../../lib/users";
import { getProjects } from "../../../lib/projects";
import { getTasks } from "../../../lib/tasks";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

const statTiles = [
  {
    label: "Users",
    key: "users" as const,
    href: "/admin/users",
    gradient: "linear-gradient(135deg, #0C66E4, #0747A6)",
    icon: "",
  },
  {
    label: "Projects",
    key: "projects" as const,
    href: "/projects",
    gradient: "linear-gradient(135deg, #6E5DC6, #4A3B96)",
    icon: "",
  },
  {
    label: "Tasks",
    key: "tasks" as const,
    href: "/tasks",
    gradient: "linear-gradient(135deg, #1F845A, #164B35)",
    icon: "",
  },
];

function AdminDashboardContent() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ users: 0, projects: 0, tasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUsers(), getProjects(), getTasks()])
      .then(([users, projects, tasks]) => {
        setCounts({ users: users.length, projects: projects.length, tasks: tasks.length });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Here&apos;s what&apos;s happening across your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statTiles.map((tile) => (
          <Link
            key={tile.key}
            href={tile.href}
            className="group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            style={{ background: tile.gradient }}
          >
            <div className="p-5">
              <span className="text-2xl">{tile.icon}</span>
              <p className="text-white text-3xl font-bold mt-3">
                {loading ? "—" : counts[tile.key]}
              </p>
              <p className="text-white/80 text-sm font-medium mt-0.5 group-hover:underline">
                {tile.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm font-medium text-foreground">Activity log</p>
          <p className="text-xs text-foreground-muted mt-0.5">
            Track recent actions across projects, tasks, and users.
          </p>
        </div>
        <Link
          href="/admin/activity"
          className="text-accent text-sm font-medium hover:underline shrink-0"
        >
          View log →
        </Link>
      </div>
    </div>
  );
}