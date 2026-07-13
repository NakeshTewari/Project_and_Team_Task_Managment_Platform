const express = require("express");
const router = express.Router();
const { getActivityLog } = require("../controllers/activityControllers");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("ADMIN"), getActivityLog);

module.exports = router;