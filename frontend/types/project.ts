export type ProjectStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "ON_HOLD";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  created_by_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  role_in_project: string | null;
  joined_at: string;
}

// Enriched shape returned when you JOIN members with user details
export interface ProjectMemberWithUser extends ProjectMember {
  user_name: string;
  user_email: string;
  user_role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
}

// Payloads for API calls
export interface CreateProjectPayload {
  name: string;
  description?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectPayload {
  name: string;
  description?: string;
  status: ProjectStatus;
}

export interface AddMemberPayload {
  userId: number;
  roleInProject?: string;
}