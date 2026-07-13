"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "../../../components/ProtectedRoute";
import ProjectCard from "../../../components/projects/ProjectCard";
import { useAuth } from "../../../context/AuthContext";
import { getProjects } from "../../../lib/projects";
import { Project } from "../../../types/project";

export default function PMDashboard() {
  return (
    <ProtectedRoute allowedRoles={["PROJECT_MANAGER"]}>
      <PMDashboardContent />
    </ProtectedRoute>
  );
}

function PMDashboardContent() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            {loading
              ? "Loading your boards..."
              : `${projects.length} project${projects.length === 1 ? "" : "s"} you manage`}
          </p>
        </div>
        <Link
          href="/projects/new"
          className="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors shrink-0"
        >
          + New project
        </Link>
      </div>

      {loading ? (
        <p className="text-foreground-muted text-sm">Loading...</p>
      ) : projects.length === 0 ? (
        <div className="bg-surface border border-dashed border-border rounded-lg p-10 text-center">
          <p className="text-foreground font-medium mb-1">No projects yet</p>
          <p className="text-sm text-foreground-muted mb-4">
            Create your first project to start assigning tasks to your team.
          </p>
          <Link
            href="/projects/new"
            className="inline-block px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
          >
            + New project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}