const express = require("express");
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject,getProjectById } = require("../controllers/projectControllers");
const {  addMember, getMembers, removeMember } = require("../controllers/memberControllers");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.post("/", protect, authorize("ADMIN", "PROJECT_MANAGER"), createProject);
router.put("/:id", protect, authorize("ADMIN", "PROJECT_MANAGER"), updateProject);
router.delete("/:id", protect, authorize("ADMIN", "PROJECT_MANAGER"), deleteProject);
router.post("/:id/members", protect, authorize("ADMIN", "PROJECT_MANAGER"), addMember);
router.get("/:id/members", protect, getMembers);
router.delete("/:id/members/:userId", protect, authorize("ADMIN", "PROJECT_MANAGER"), removeMember);
module.exports = router;