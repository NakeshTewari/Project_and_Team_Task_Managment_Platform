import api from "./api";

export interface ActivityLogEntry {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export async function getActivityLog(): Promise<ActivityLogEntry[]> {
  const { data } = await api.get<ActivityLogEntry[]>("/activity");
  return data;
}