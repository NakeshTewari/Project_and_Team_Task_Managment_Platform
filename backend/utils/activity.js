const pool = require("../db");

/**
 * Records an action in the activity_logs table.
 * @param {number} userId - id of the user who performed the action
 * @param {string} action - short code describing what happened, e.g. "TASK_CREATED"
 * @param {string} entityType - the type of record affected, e.g. "Task", "Project", "User"
 * @param {number} entityId - the id of that specific record
 * @param {object|null} metadata - optional extra context, stored as JSON
 */
const logActivity = async (userId, action, entityType, entityId, metadata = null) => {
  try {
    await pool.query(
      "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?)",
      [userId, action, entityType, entityId, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
};

module.exports = { logActivity };