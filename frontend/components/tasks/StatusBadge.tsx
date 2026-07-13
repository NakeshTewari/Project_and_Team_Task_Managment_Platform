import { TaskStatus } from "../../types/task";

const styles: Record<TaskStatus, string> = {
  TODO: "bg-status-todo-bg text-status-todo",
  IN_PROGRESS: "bg-status-in-progress-bg text-status-in-progress",
  IN_REVIEW: "bg-status-in-review-bg text-status-in-review",
  DONE: "bg-status-done-bg text-status-done",
};

const labels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  IN_REVIEW: "In review",
  DONE: "Done",
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}