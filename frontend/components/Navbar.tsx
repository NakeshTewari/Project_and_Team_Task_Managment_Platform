"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import RoleBadge from "./ui/RoleBadge";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  
  if (!user || pathname === "/login" || pathname === "/register") return null;

  const dashboardHref =
    user.role === "ADMIN" ? "/admin/dashboard" : user.role === "PROJECT_MANAGER" ? "/pm/dashboard" : "/member/dashboard";

  return (
    <nav className="border-b border-border px-6 py-3 flex justify-between items-center bg-surface">
      <div className="flex items-center gap-6">
        <Link href={dashboardHref} className="font-semibold">
          CyphLab Tasks
        </Link>
        <Link href="/projects" className="text-sm text-foreground-muted hover:text-foreground">
          Projects
        </Link>
        <Link href="/tasks" className="text-sm text-foreground-muted hover:text-foreground">
          Tasks
        </Link>
        {user.role === "ADMIN" && (
          <>
            <Link href="/admin/users" className="text-sm text-foreground-muted hover:text-foreground">
              Users
            </Link>
            <Link href="/admin/activity" className="text-sm text-foreground-muted hover:text-foreground">
              Activity
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <RoleBadge role={user.role} />
        <span className="text-sm">{user.name}</span>
        <LogoutButton />
      </div>
    </nav>
  );
}