"use client";

import Link from "next/link";
import { Project } from "../../types/project";

interface ProjectCardProps {
  project: Project;
}

const statusLabels: Record<Project["status"], string> = {
  PLANNED: "Planned",
  ACTIVE: "Active",
  ON_HOLD: "On hold",
  COMPLETED: "Completed",
};

// Cycles a fixed set of Trello-style board colors based on project id,
// so each board tile gets a consistent, distinct color without needing
// a color field in the database.
const boardColors = [
  "linear-gradient(135deg, var(--board-blue), var(--board-blue-dark))",
  "linear-gradient(135deg, var(--board-purple), var(--board-purple-dark))",
  "linear-gradient(135deg, var(--board-teal), var(--board-teal-dark))",
  "linear-gradient(135deg, var(--board-red), var(--board-red-dark))",
  "linear-gradient(135deg, var(--board-gold), var(--board-gold-dark))",
];

function colorForProject(id: number) {
  return boardColors[id % boardColors.length];
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-[var(--radius)] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div
        className="h-24 p-3 flex flex-col justify-between"
        style={{ background: colorForProject(project.id) }}
      >
        <span className="self-start px-2 py-0.5 rounded text-[11px] font-medium text-white/90 bg-black/15">
          {statusLabels[project.status]}
        </span>
        <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 group-hover:underline">
          {project.name}
        </h3>
      </div>

      {project.description && (
        <div className="bg-surface-card px-3 py-2 border-t border-border rounded-b-[var(--radius)]">
          <p className="text-xs text-foreground-muted line-clamp-2">
            {project.description}
          </p>
        </div>
      )}
    </Link>
  );
}
