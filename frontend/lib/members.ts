import api from "./api";
import { ProjectMemberWithUser, AddMemberPayload } from "../types/project";

export async function getMembers(projectId: number): Promise<ProjectMemberWithUser[]> {
  const { data } = await api.get<ProjectMemberWithUser[]>(`/projects/${projectId}/members`);
  return data;
}

export async function addMember(projectId: number, payload: AddMemberPayload): Promise<void> {
  await api.post(`/projects/${projectId}/members`, payload);
}

export async function removeMember(projectId: number, userId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/members/${userId}`);
}