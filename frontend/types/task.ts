export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  project_id: number;
  assigned_to_id: number | null;
  created_by_id: number;
  created_at: string;
  updated_at: string;
}

// Enriched shape returned by getTasks (matches your JOIN query)
export interface TaskWithDetails extends Task {
  assigned_to_name: string | null;
  project_name: string;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

// Enriched shape when comments are joined with the commenter's name
export interface TaskCommentWithUser extends TaskComment {
  user_name: string;
}

// Payloads for API calls
export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  projectId: number;
  assignedToId?: number | null;
}

export interface UpdateTaskPayload {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  assignedToId: number | null;
  status: TaskStatus;
}

export interface UpdateProgressPayload {
  status: TaskStatus;
}

export interface CreateCommentPayload {
  taskId: number;
  content: string;
}