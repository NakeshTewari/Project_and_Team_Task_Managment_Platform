import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-surface p-10 shadow-xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">
          Project & Team Task Management Platform
        </h1>

        <p className="mb-10 text-lg text-foreground-muted">
          Organize projects, assign tasks, collaborate with your team, and
          track progress in one place.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Register
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-5">
            <h2 className="mb-2 text-lg font-semibold text-foreground">
               Projects
            </h2>
            <p className="text-sm text-foreground-muted">
              Create and manage multiple projects with ease.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background p-5">
            <h2 className="mb-2 text-lg font-semibold text-foreground">
               Tasks
            </h2>
            <p className="text-sm text-foreground-muted">
              Assign, prioritize, and track tasks efficiently.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background p-5">
            <h2 className="mb-2 text-lg font-semibold text-foreground">
               Teams
            </h2>
            <p className="text-sm text-foreground-muted">
              Collaborate with administrators, managers, and team members.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}