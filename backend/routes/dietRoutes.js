const express = require("express");
const auth = require("../middleware/auth");
const {
  generateDietPlan,
  getMyDietPlans,
  getDietPlanById,
  getDashboardData,
} = require("../controllers/dietController");

const router = express.Router();

router.post("/generate", auth, generateDietPlan);
router.get("/dashboard", auth, getDashboardData);
router.get("/mine", auth, getMyDietPlans);
router.get("/:id", auth, getDietPlanById);

module.exports = router;
