"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../../../components/ProtectedRoute";
import ProjectForm from "../../../components/projects/ProjectForm";
import { createProject } from "../../../lib/projects";
import { ProjectStatus } from "../../../types/project";

export default function NewProjectPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "PROJECT_MANAGER"]}>
      <NewProjectContent />
    </ProtectedRoute>
  );
}

function NewProjectContent() {
  const router = useRouter();

  const handleSubmit = async (data: { name: string; description: string; status: ProjectStatus }) => {
    const project = await createProject(data);
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Link href="/projects" className="text-accent text-sm hover:underline">
        ← Back to projects
      </Link>

      <div className="mt-4 mb-6">
        <h1 className="text-xl font-semibold text-foreground">Create project</h1>
        <p className="text-sm text-foreground-muted mt-1">
          Set up a new board for your team to start tracking work.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
        <ProjectForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </div>
  );
}