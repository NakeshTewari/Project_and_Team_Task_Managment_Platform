"use client";

import { ProjectMemberWithUser } from "../../types/project";

interface MemberListProps {
  members: ProjectMemberWithUser[];
  canManage: boolean;
  onRemove: (userId: number) => void;
}

export default function MemberList({ members, canManage, onRemove }: MemberListProps) {
  if (members.length === 0) {
    return <p className="text-sm text-foreground-muted">No members added yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex justify-between items-center border border-border rounded px-3 py-2 text-sm"
        >
          <div>
            <span className="font-medium">{member.user_name}</span>
            <span className="text-foreground-muted ml-2">{member.user_email}</span>
            {member.role_in_project && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-surface-muted text-foreground-muted">
                {member.role_in_project}
              </span>
            )}
          </div>
          {canManage && (
            <button
              onClick={() => onRemove(member.user_id)}
              className="text-danger hover:underline text-xs"
            >
              Remove
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}