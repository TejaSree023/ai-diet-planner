const express = require("express");
const auth = require("../middleware/auth");
const { upsertMealLog, getMealLog, getMealSummary } = require("../controllers/mealLogController");

const router = express.Router();

router.get("/", auth, getMealLog);
router.post("/", auth, upsertMealLog);
router.get("/summary", auth, getMealSummary);

module.exports = router;
