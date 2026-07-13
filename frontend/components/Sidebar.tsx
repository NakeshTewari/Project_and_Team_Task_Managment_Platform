"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 border-r border-border p-4 space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block px-3 py-2 rounded text-sm ${
            pathname.startsWith(link.href)
              ? "bg-accent-subtle text-accent"
              : "text-foreground-muted hover:bg-surface-muted"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}