"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import ActivityFeed from "../../../components/activity/ActivityFeed";
import { getActivityLog, ActivityLogEntry } from "../../../lib/activity";

export default function AdminActivityPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <ActivityContent />
    </ProtectedRoute>
  );
}

function ActivityContent() {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLog()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Activity log</h1>
        <p className="text-sm text-foreground-muted mt-1">
          Recent actions across all projects and tasks.
        </p>
      </div>

      {loading ? (
        <p className="text-foreground-muted text-sm">Loading activity...</p>
      ) : (
        <div className="bg-surface border border-border rounded-lg shadow-sm">
          <ActivityFeed entries={entries} />
        </div>
      )}
    </div>
  );
}