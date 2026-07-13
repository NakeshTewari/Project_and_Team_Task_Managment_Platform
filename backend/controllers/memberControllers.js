const pool = require("../db");
const { logActivity } = require("../utils/activity");

exports.addMember = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { userId, roleInProject } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const [project] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId]);
    if (project.length === 0) return res.status(404).json({ message: "Project not found" });

    if (req.user.role === "PROJECT_MANAGER" && project[0].created_by_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to manage this project" });
    }

    const [userExists] = await pool.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (userExists.length === 0) return res.status(404).json({ message: "User not found" });

    try {
      const [result] = await pool.query(
        "INSERT INTO project_members (project_id, user_id, role_in_project) VALUES (?, ?, ?)",
        [projectId, userId, roleInProject || "CONTRIBUTOR"]
      );
      await logActivity(req.user.id, "MEMBER_ADDED", "Project", projectId, { addedUserId: userId });
      res.status(201).json({ id: result.insertId, projectId, userId, roleInProject });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "User is already a member of this project" });
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to add member", error: err.message });
  }
};

exports.getMembers = async (req, res) => {
  const { id: projectId } = req.params;

  const [members] = await pool.query(
    `SELECT pm.id, pm.project_id, pm.user_id, pm.role_in_project, pm.joined_at,
            u.name AS user_name, u.email AS user_email, u.role AS user_role
     FROM project_members pm
     JOIN users u ON pm.user_id = u.id
     WHERE pm.project_id = ?
     ORDER BY pm.joined_at ASC`,
    [projectId]
  );
  res.json(members);
};

exports.removeMember = async (req, res) => {
  const { id: projectId, userId } = req.params;

  const [project] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId]);
  if (project.length === 0) return res.status(404).json({ message: "Project not found" });

  if (req.user.role === "PROJECT_MANAGER" && project[0].created_by_id !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to manage this project" });
  }

  const [result] = await pool.query(
    "DELETE FROM project_members WHERE project_id = ? AND user_id = ?",
    [projectId, userId]
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Member not found in this project" });
  }

  await logActivity(req.user.id, "MEMBER_REMOVED", "Project", projectId, { removedUserId: Number(userId) });
  res.json({ message: "Member removed successfully" });
};