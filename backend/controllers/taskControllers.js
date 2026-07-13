const pool = require("../db");
const { logActivity } = require("../utils/activity");

exports.getTasks = async (req, res) => {
  const { id, role } = req.user;
  const { projectId } = req.query;

  let query = `SELECT t.*, u.name AS assigned_to_name, p.name AS project_name
               FROM tasks t
               LEFT JOIN users u ON t.assigned_to_id = u.id
               JOIN projects p ON t.project_id = p.id
               WHERE 1=1`;
  const params = [];

  if (projectId) {
    query += " AND t.project_id = ?";
    params.push(projectId);
  }
  if (role === "TEAM_MEMBER") {
    query += " AND t.assigned_to_id = ?";
    params.push(id);
  }

  query += " ORDER BY t.due_date ASC";
  const [tasks] = await pool.query(query, params);
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId, assignedToId } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ message: "title and projectId are required" });
    }

    const [project] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId]);
    if (project.length === 0) return res.status(404).json({ message: "Project not found" });

    if (req.user.role === "PROJECT_MANAGER" && project[0].created_by_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to add tasks to this project" });
    }

    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, priority, due_date, project_id, assigned_to_id, created_by_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, priority || "MEDIUM", dueDate || null, projectId, assignedToId || null, req.user.id]
    );

    await logActivity(req.user.id, "TASK_CREATED", "Task", result.insertId);
    res.status(201).json({ id: result.insertId, title, projectId, status: "TODO" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, dueDate, assignedToId, status } = req.body;

  const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
  if (rows.length === 0) return res.status(404).json({ message: "Task not found" });

  await pool.query(
    `UPDATE tasks SET title = ?, description = ?, priority = ?, due_date = ?, assigned_to_id = ?, status = ?
     WHERE id = ?`,
    [title, description, priority, dueDate, assignedToId, status, id]
  );

  await logActivity(req.user.id, "TASK_UPDATED", "Task", id);
  res.json({ message: "Task updated successfully" });
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Task not found" });

  await logActivity(req.user.id, "TASK_DELETED", "Task", id);
  res.json({ message: "Task deleted successfully" });
};

// PATCH /tasks/:id/progress — the endpoint Team Members actually use day-to-day
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${validStatuses.join(", ")}` });
    }

    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Task not found" });

    const task = rows[0];

    // Team Members may only update status on tasks assigned to them.
    // Admin/PM can update any task's progress.
    if (req.user.role === "TEAM_MEMBER" && task.assigned_to_id !== req.user.id) {
      return res.status(403).json({ message: "You can only update progress on your own tasks" });
    }

    await pool.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);
    await logActivity(req.user.id, "TASK_STATUS_CHANGED", "Task", id, {
      from: task.status,
      to: status,
    });

    res.json({ message: "Progress updated", status });
  } catch (err) {
    res.status(500).json({ message: "Failed to update progress", error: err.message });
  }
};