"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../../../components/ProtectedRoute";
import ProjectForm from "../../../components/projects/ProjectForm";
import AddMemberModal from "../../../components/projects/AddMemberModal";
import MemberList from "../../../components/projects/MemberList";
import { getProject, updateProject, deleteProject } from "../../../lib/projects";
import { getTasks } from "../../../lib/tasks";
import { getMembers, addMember, removeMember } from "../../../lib/members";
import { useAuth } from "../../../context/AuthContext";
import { Project, ProjectStatus, ProjectMemberWithUser } from "../../../types/project";
import { TaskWithDetails } from "../../../types/task";

export default function ProjectDetailPage() {
  return (
    <ProtectedRoute>
      <ProjectDetailContent />
    </ProtectedRoute>
  );
}

const boardColors = [
  "linear-gradient(135deg, #0C66E4, #0747A6)",
  "linear-gradient(135deg, #6E5DC6, #4A3B96)",
  "linear-gradient(135deg, #1F845A, #164B35)",
  "linear-gradient(135deg, #C9372C, #8B241C)",
  "linear-gradient(135deg, #B38600, #7A5900)",
];

function colorForProject(id: number) {
  return boardColors[id % boardColors.length];
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const statusLabels: Record<ProjectStatus, string> = {
  PLANNED: "Planned",
  ACTIVE: "Active",
  ON_HOLD: "On hold",
  COMPLETED: "Completed",
};

function ProjectDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [members, setMembers] = useState<ProjectMemberWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const canManage = user?.role === "ADMIN" || user?.role === "PROJECT_MANAGER";

  const load = useCallback(async () => {
    setLoading(true);
    const [projectData, taskData, memberData] = await Promise.all([
      getProject(Number(id)),
      getTasks(Number(id)),
      getMembers(Number(id)),
    ]);
    setProject(projectData);
    setTasks(taskData);
    setMembers(memberData);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdate = async (data: { name: string; description: string; status: ProjectStatus }) => {
    await updateProject(Number(id), data);
    setEditing(false);
    await load();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project? This also removes its tasks and members.")) return;
    await deleteProject(Number(id));
    router.push("/projects");
  };

  const handleAddMember = async (userId: number, roleInProject: string) => {
    await addMember(Number(id), { userId, roleInProject });
    await load();
  };

  const handleRemoveMember = async (userId: number) => {
    if (!confirm("Remove this member from the project?")) return;
    await removeMember(Number(id), userId);
    await load();
  };

  if (loading) return <p className="max-w-4xl mx-auto py-10 px-4 text-foreground-muted">Loading...</p>;
  if (!project) return <p className="max-w-4xl mx-auto py-10 px-4">Project not found.</p>;

  return (
    <div>
      {/* Board header banner */}
      <div className="px-6 py-5" style={{ background: colorForProject(project.id) }}>
        <div className="max-w-4xl mx-auto">
          {editing ? (
            <div className="bg-surface rounded-lg p-4">
              <ProjectForm initialData={project} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
            </div>
          ) : (
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium text-white/90 bg-black/15 mb-2">
                  {statusLabels[project.status]}
                </span>
                <h1 className="text-white text-2xl font-semibold">{project.name}</h1>
                {project.description && (
                  <p className="text-white/80 text-sm mt-1 max-w-lg">{project.description}</p>
                )}
              </div>
              {canManage && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-white/15 text-white hover:bg-white/25 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-white/15 text-white hover:bg-danger transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Member avatar stack */}
          {members.length > 0 && (
            <div className="flex items-center -space-x-2 mt-4">
              {members.slice(0, 6).map((m) => (
                <div
                  key={m.id}
                  title={m.user_name}
                  className="w-8 h-8 rounded-full bg-white text-accent text-xs font-semibold flex items-center justify-center border-2 border-white/40"
                >
                  {initials(m.user_name)}
                </div>
              ))}
              {members.length > 6 && (
                <div className="w-8 h-8 rounded-full bg-black/20 text-white text-xs font-semibold flex items-center justify-center border-2 border-white/40">
                  +{members.length - 6}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium text-foreground">Members ({members.length})</h2>
            {canManage && (
              <button onClick={() => setAddMemberOpen(true)} className="text-accent text-sm hover:underline">
                Add member
              </button>
            )}
          </div>
          <MemberList members={members} canManage={canManage} onRemove={handleRemoveMember} />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium text-foreground">Tasks ({tasks.length})</h2>
            <Link href={`/projects/${id}/tasks`} className="text-accent text-sm hover:underline">
              Open task board →
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-foreground-muted text-sm">No tasks yet.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="bg-surface border border-border rounded-md p-3 text-sm shadow-sm hover:shadow transition-shadow"
                >
                  <Link href={`/tasks/${task.id}`} className="hover:underline font-medium">
                    {task.title}
                  </Link>{" "}
                  <span className="text-foreground-muted">— {task.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AddMemberModal
        isOpen={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onSubmit={handleAddMember}
        existingMemberIds={members.map((m) => m.user_id)}
      />
    </div>
  );
}