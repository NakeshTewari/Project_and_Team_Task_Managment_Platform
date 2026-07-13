const express = require("express");
const router = express.Router({ mergeParams: true }); // needed to access :id from parent mount
const { getComments, addComment } = require("../controllers/commentControllers");
const { protect } = require("../middleware/auth");

router.get("/", protect, getComments);
router.post("/", protect, addComment);

module.exports = router;