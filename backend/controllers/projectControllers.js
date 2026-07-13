const pool = require("../db");
const { logActivity } = require("../utils/activity");

exports.getProjects = async (req, res) => {
  const { id, role } = req.user;
  let query, params;

  if (role === "ADMIN") {
    query = "SELECT * FROM projects ORDER BY created_at DESC";
    params = [];
  } else if (role === "PROJECT_MANAGER") {
    query = `SELECT DISTINCT p.* FROM projects p
             LEFT JOIN project_members pm ON pm.project_id = p.id
             WHERE p.created_by_id = ? OR pm.user_id = ?
             ORDER BY p.created_at DESC`;
    params = [id, id];
  } else {
    query = `SELECT p.* FROM projects p
             JOIN project_members pm ON pm.project_id = p.id
             WHERE pm.user_id = ?
             ORDER BY p.created_at DESC`;
    params = [id];
  }

  const [projects] = await pool.query(query, params);
  res.json(projects);
};

exports.createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const [result] = await pool.query(
      "INSERT INTO projects (name, description, status, created_by_id) VALUES (?, ?, ?, ?)",
      [name, description || null, status || "PLANNED", req.user.id]
    );

    await logActivity(req.user.id, "PROJECT_CREATED", "Project", result.insertId);
    res.status(201).json({ id: result.insertId, name, description, status: status || "PLANNED" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create project", error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
  if (rows.length === 0) return res.status(404).json({ message: "Project not found" });

  // PM can only edit their own projects; Admin can edit any
  if (req.user.role === "PROJECT_MANAGER" && rows[0].created_by_id !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to edit this project" });
  }

  await pool.query(
    "UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?",
    [name, description, status, id]
  );

  await logActivity(req.user.id, "PROJECT_UPDATED", "Project", id);
  res.json({ message: "Project updated successfully" });
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
  if (rows.length === 0) return res.status(404).json({ message: "Project not found" });

  if (req.user.role === "PROJECT_MANAGER" && rows[0].created_by_id !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to delete this project" });
  }

  await pool.query("DELETE FROM projects WHERE id = ?", [id]); // cascades to members/tasks
  await logActivity(req.user.id, "PROJECT_DELETED", "Project", id);
  res.json({ message: "Project deleted successfully" });
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;

  const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
  if (rows.length === 0) return res.status(404).json({ message: "Project not found" });

  const project = rows[0];

  // Team Members can only view projects they're a member of
  if (role === "TEAM_MEMBER") {
    const [membership] = await pool.query(
      "SELECT id FROM project_members WHERE project_id = ? AND user_id = ?",
      [id, userId]
    );
    if (membership.length === 0) {
      return res.status(403).json({ message: "Not a member of this project" });
    }
  }

  res.json(project);
};