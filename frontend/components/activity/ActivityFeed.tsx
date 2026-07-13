import { ActivityLogEntry } from "../../lib/activity";

const actionLabels: Record<string, string> = {
  TASK_CREATED: "created a task",
  TASK_UPDATED: "updated a task",
  TASK_DELETED: "deleted a task",
  TASK_STATUS_CHANGED: "changed task status",
  PROJECT_CREATED: "created a project",
  PROJECT_UPDATED: "updated a project",
  PROJECT_DELETED: "deleted a project",
  MEMBER_ADDED: "added a member",
  MEMBER_REMOVED: "removed a member",
  USER_CREATED: "created a user",
  USER_UPDATED: "updated a user",
  USER_DELETED: "deleted a user",
};

const actionDotColor: Record<string, string> = {
  TASK_CREATED: "bg-status-done",
  TASK_UPDATED: "bg-status-in-progress",
  TASK_DELETED: "bg-danger",
  TASK_STATUS_CHANGED: "bg-status-in-review",
  PROJECT_CREATED: "bg-status-done",
  PROJECT_UPDATED: "bg-status-in-progress",
  PROJECT_DELETED: "bg-danger",
  MEMBER_ADDED: "bg-role-pm",
  MEMBER_REMOVED: "bg-danger",
  USER_CREATED: "bg-status-done",
  USER_UPDATED: "bg-status-in-progress",
  USER_DELETED: "bg-danger",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ActivityFeed({ entries }: { entries: ActivityLogEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-foreground-muted px-4 py-6 text-center">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-start gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-accent-subtle text-accent text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
            {initials(entry.user_name)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">
              <span className="font-medium">{entry.user_name}</span>{" "}
              {actionLabels[entry.action] ?? entry.action.toLowerCase().replace(/_/g, " ")}{" "}
              <span className="text-foreground-muted">
                ({entry.entity_type} #{entry.entity_id})
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${actionDotColor[entry.action] ?? "bg-foreground-muted"}`} />
            <span className="text-xs text-foreground-muted whitespace-nowrap">
              {timeAgo(entry.created_at)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}