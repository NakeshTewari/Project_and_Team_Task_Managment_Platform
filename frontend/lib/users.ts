import api from "./api";
import { User, Role } from "../types/auth";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  role: Role;
}

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/users");
  return data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await api.post<User>("/users", payload);
  return data;
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<void> {
  await api.put(`/users/${id}`, payload);
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}