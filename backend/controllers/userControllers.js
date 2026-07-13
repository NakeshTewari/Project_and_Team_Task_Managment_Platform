const bcrypt = require("bcryptjs");
const pool = require("../db");
const { logActivity } = require("../utils/activity");

exports.getUsers = async (req, res) => {
  const [users] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
  );
  res.json(users);
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "TEAM_MEMBER"]
    );

    await logActivity(req.user.id, "USER_CREATED", "User", result.insertId);
    res.status(201).json({ id: result.insertId, name, email, role: role || "TEAM_MEMBER" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create user", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const [existing] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ message: "User not found" });

    await pool.query(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id]
    );

    await logActivity(req.user.id, "USER_UPDATED", "User", id);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  // prevent an admin from deleting their own account mid-session
  if (Number(id) === req.user.id) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }

  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

  await logActivity(req.user.id, "USER_DELETED", "User", id);
  res.json({ message: "User deleted successfully" });
};