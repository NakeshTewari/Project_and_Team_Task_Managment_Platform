import { TaskCommentWithUser } from "../../types/task";

export default function CommentList({ comments }: { comments: TaskCommentWithUser[] }) {
  if (comments.length === 0) {
    return <p className="text-sm text-foreground-muted">No comments yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c.id} className="text-sm border-b border-border pb-2">
          <div className="flex justify-between text-xs text-foreground-muted mb-1">
            <span className="font-medium text-foreground">{c.user_name}</span>
            <span>{new Date(c.created_at).toLocaleString()}</span>
          </div>
          <p>{c.content}</p>
        </li>
      ))}
    </ul>
  );
}