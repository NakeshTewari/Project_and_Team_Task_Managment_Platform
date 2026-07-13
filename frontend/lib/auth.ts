import api from "./api";
import { AuthResponse, RegisterPayload, User } from "../types/auth";

export async function loginUser(email: string, password: string): Promise<User> {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data.user;
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data.user;
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}