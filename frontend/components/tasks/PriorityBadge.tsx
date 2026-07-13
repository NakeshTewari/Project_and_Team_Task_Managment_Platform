import { TaskPriority } from "../../types/task";

const styles: Record<TaskPriority, string> = {
  LOW: "text-priority-low",
  MEDIUM: "text-priority-medium",
  HIGH: "text-priority-high",
};

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`text-xs font-medium ${styles[priority]}`}>
      {priority === "HIGH" && "● "}
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}