"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/LogoutButton";

const roleStyles: Record<string, string> = {
  ADMIN: "bg-role-admin-bg text-role-admin",
  PROJECT_MANAGER: "bg-role-pm-bg text-role-pm",
  TEAM_MEMBER: "bg-role-member-bg text-role-member",
};

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  PROJECT_MANAGER: "Project Manager",
  TEAM_MEMBER: "Team Member",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-xl font-semibold text-foreground mb-6">My profile</h1>

      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <div
          className="h-16"
          style={{ background: "linear-gradient(135deg, #0C66E4, #0747A6)" }}
        />

        <div className="px-6 pb-6">
          <div className="w-16 h-16 rounded-full bg-surface border-4 border-surface -mt-8 mb-3 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-accent-subtle text-accent text-lg font-semibold flex items-center justify-center">
              {initials(user.name)}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
          <p className="text-sm text-foreground-muted mb-3">{user.email}</p>

          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${roleStyles[user.role]}`}>
            {roleLabels[user.role]}
          </span>

          <div className="mt-6 pt-4 border-t border-border">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}