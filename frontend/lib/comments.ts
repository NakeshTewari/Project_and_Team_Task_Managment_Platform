import api from "./api";
import { TaskCommentWithUser, CreateCommentPayload } from "../types/task";

export async function getComments(taskId: number): Promise<TaskCommentWithUser[]> {
  const { data } = await api.get<TaskCommentWithUser[]>(`/tasks/${taskId}/comments`);
  return data;
}

export async function addComment(payload: CreateCommentPayload): Promise<TaskCommentWithUser> {
  const { data } = await api.post<TaskCommentWithUser>(`/tasks/${payload.taskId}/comments`, {
    content: payload.content,
  });
  return data;
}