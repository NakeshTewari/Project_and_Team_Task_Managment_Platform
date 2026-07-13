import api from "./api";
import {
  TaskWithDetails,
  CreateTaskPayload,
  UpdateTaskPayload,
  UpdateProgressPayload,
  TaskStatus,
} from "../types/task";

export async function getTasks(projectId?: number): Promise<TaskWithDetails[]> {
  const { data } = await api.get<TaskWithDetails[]>("/tasks", {
    params: projectId ? { projectId } : undefined,
  });
  return data;
}

export async function createTask(payload: CreateTaskPayload): Promise<TaskWithDetails> {
  const { data } = await api.post<TaskWithDetails>("/tasks", payload);
  return data;
}

export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<void> {
  await api.put(`/tasks/${id}`, payload);
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function updateProgress(id: number, status: TaskStatus): Promise<void> {
  const payload: UpdateProgressPayload = { status };
  await api.patch(`/tasks/${id}/progress`, payload);
}