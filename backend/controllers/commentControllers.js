const pool = require("../db");

exports.getComments = async (req, res) => {
  const { id: taskId } = req.params;

  const [comments] = await pool.query(
    `SELECT tc.id, tc.task_id, tc.user_id, tc.content, tc.created_at, u.name AS user_name
     FROM task_comments tc
     JOIN users u ON tc.user_id = u.id
     WHERE tc.task_id = ?
     ORDER BY tc.created_at ASC`,
    [taskId]
  );
  res.json(comments);
};

exports.addComment = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    // confirm the task exists and, for Team Members, that they belong to its project
    const [taskRows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
    if (taskRows.length === 0) return res.status(404).json({ message: "Task not found" });

    if (req.user.role === "TEAM_MEMBER") {
      const [membership] = await pool.query(
        "SELECT id FROM project_members WHERE project_id = ? AND user_id = ?",
        [taskRows[0].project_id, req.user.id]
      );
      if (membership.length === 0) {
        return res.status(403).json({ message: "Not a member of this task's project" });
      }
    }

    const [result] = await pool.query(
      "INSERT INTO task_comments (task_id, user_id, content) VALUES (?, ?, ?)",
      [taskId, req.user.id, content]
    );

    const [newComment] = await pool.query(
      `SELECT tc.id, tc.task_id, tc.user_id, tc.content, tc.created_at, u.name AS user_name
       FROM task_comments tc JOIN users u ON tc.user_id = u.id WHERE tc.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newComment[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment", error: err.message });
  }
};