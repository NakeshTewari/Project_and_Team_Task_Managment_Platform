"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "../lib/auth";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
