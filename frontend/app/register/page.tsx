"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";
import { Role, RegisterPayload } from "../../types/auth";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
    role: "TEAM_MEMBER",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await registerUser(form);
      setUser(user);
      
      if (user.role === "ADMIN") router.push("/admin/dashboard");
      else if (user.role === "PROJECT_MANAGER") router.push("/pm/dashboard");
      else router.push("/member/dashboard");
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-foreground">
          Create Account
        </h1>

        <p className="mb-8 text-center text-sm text-foreground-muted">
          Join your team and start managing projects.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground-muted focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground-muted focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground-muted focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Role
            </label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="TEAM_MEMBER">Team Member</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-100 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
