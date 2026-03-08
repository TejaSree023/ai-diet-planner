const express = require("express");
const auth = require("../middleware/auth");
const { addProgressLog, getProgressLogs } = require("../controllers/progressController");

const router = express.Router();

router.get("/", auth, getProgressLogs);
router.post("/", auth, addProgressLog);

module.exports = router;
