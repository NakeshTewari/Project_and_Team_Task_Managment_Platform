import api from "./api";
import { Project, CreateProjectPayload, UpdateProjectPayload } from "../types/project";

export async function getProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>("/projects");
  return data;
}

export async function getProject(id: number): Promise<Project> {
  const { data } = await api.get<Project>(`/projects/${id}`);
  return data;
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const { data } = await api.post<Project>("/projects", payload);
  return data;
}

export async function updateProject(id: number, payload: UpdateProjectPayload): Promise<void> {
  await api.put(`/projects/${id}`, payload);
}

export async function deleteProject(id: number): Promise<void> {
  await api.delete(`/projects/${id}`);
}