const pool = require("../db");

exports.getActivityLog = async (req, res) => {
  const [logs] = await pool.query(
    `SELECT al.id, al.user_id, u.name AS user_name, al.action, al.entity_type,
            al.entity_id, al.metadata, al.created_at
     FROM activity_logs al
     JOIN users u ON al.user_id = u.id
     ORDER BY al.created_at DESC
     LIMIT 100`
  );
  res.json(logs);
};