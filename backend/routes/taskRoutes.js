const express = require("express");
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, updateProgress } = require("../controllers/taskControllers");
const { protect, authorize } = require("../middleware/auth");
const commentRoutes = require("./commentRoutes");

router.get("/", protect, getTasks);
router.post("/", protect, authorize("ADMIN", "PROJECT_MANAGER"), createTask);
router.put("/:id", protect, authorize("ADMIN", "PROJECT_MANAGER"), updateTask);
router.delete("/:id", protect, authorize("ADMIN", "PROJECT_MANAGER"), deleteTask);
router.patch("/:id/progress", protect, updateProgress); // any role, scoped in controller
router.use("/:id/comments", commentRoutes);

module.exports = router;