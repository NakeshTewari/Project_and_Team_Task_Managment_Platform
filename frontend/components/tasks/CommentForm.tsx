"use client";

import { useState, FormEvent } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export default function CommentForm({ onSubmit }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 border border-border rounded px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded bg-accent hover:bg-accent-hover text-white text-sm"
      >
        Post
      </button>
    </form>
  );
}