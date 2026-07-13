import { Role } from "../../types/auth";

const styles: Record<Role, string> = {
  ADMIN: "bg-role-admin-bg text-role-admin",
  PROJECT_MANAGER: "bg-role-pm-bg text-role-pm",
  TEAM_MEMBER: "bg-role-member-bg text-role-member",
};

const labels: Record<Role, string> = {
  ADMIN: "Admin",
  PROJECT_MANAGER: "Project Manager",
  TEAM_MEMBER: "Team Member",
};

export default function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${styles[role]}`}>
      {labels[role]}
    </span>
  );
}