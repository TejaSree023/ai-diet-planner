const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const DietPlan = require("../models/DietPlan");
const MealLog = require("../models/MealLog");
const ProgressLog = require("../models/ProgressLog");
const LoginEvent = require("../models/LoginEvent");
const ApiUsageEvent = require("../models/ApiUsageEvent");
const {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateDailyCalories,
} = require("../utils/calculations");

const router = express.Router();

const normalizeDietPreference = (value) => {
  const raw = String(value || "").toLowerCase().trim();
  if (["non-veg", "non veg", "nonveg", "non_veg", "nonvegetarian", "non-vegetarian"].includes(raw)) {
    return "non-veg";
  }
  if (["egg", "eggetarian", "eggeterian", "eggitarian"].includes(raw)) {
    return "eggetarian";
  }
  if (raw === "vegan") {
    return "vegan";
  }
  return "veg";
};

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let metrics = null;
    if (user.height && user.weight && user.age && user.gender) {
      const goal = user.goal || user.healthGoal || "maintenance";
      const bmi = calculateBMI(user.weight, user.height);
      const bmr = calculateBMR({
        gender: user.gender,
        weight: user.weight,
        height: user.height,
        age: user.age,
      });
      const tdee = calculateTDEE({ bmr, activityLevel: user.activityLevel });
      const dailyCalories = calculateDailyCalories({ tdee, goal });
      metrics = { bmi, bmr, tdee, dailyCalories };
    }

    return res.json({ ...user.toObject(), metrics });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "age",
      "height",
      "weight",
      "gender",
      "activityLevel",
      "dietPreference",
      "wakeTime",
      "sleepTime",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.dietPreference !== undefined) {
      updates.dietPreference = normalizeDietPreference(updates.dietPreference);
    }

    const nextGoal = req.body.goal || req.body.healthGoal;
    if (nextGoal) {
      updates.goal = nextGoal;
      updates.healthGoal = nextGoal;
    }

    if (req.body.allergies !== undefined) {
      updates.allergies = Array.isArray(req.body.allergies) ? req.body.allergies : [];
    }

    if (req.body.reminderSettings !== undefined) {
      updates.reminderSettings = {
        water: req.body.reminderSettings?.water !== false,
        meals: req.body.reminderSettings?.meals !== false,
        weighIn: Boolean(req.body.reminderSettings?.weighIn),
      };
    }

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/export-data", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [user, plans, mealLogs, progressLogs] = await Promise.all([
      User.findById(userId).select("-password").lean(),
      DietPlan.find({ user: userId }).sort({ createdAt: -1 }).lean(),
      MealLog.find({ user: userId }).sort({ date: -1 }).lean(),
      ProgressLog.find({ user: userId }).sort({ date: -1 }).lean(),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      exportedAt: new Date().toISOString(),
      user,
      dietPlans: plans,
      mealLogs,
      progressLogs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/logs", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [progressResult, mealResult] = await Promise.all([
      ProgressLog.deleteMany({ user: userId }),
      MealLog.deleteMany({ user: userId }),
    ]);

    return res.json({
      message: "All logs deleted successfully",
      deletedProgressLogs: progressResult.deletedCount || 0,
      deletedMealLogs: mealResult.deletedCount || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/measurements", auth, async (req, res) => {
  try {
    const allowed = ["neck", "chest", "waist", "hips"];
    const setOps = {};

    for (const field of allowed) {
      if (req.body[field] === undefined) {
        continue;
      }

      const raw = req.body[field];

      if (raw === null || raw === "") {
        setOps[`bodyMeasurements.${field}`] = null;
        continue;
      }

      const value = Number(raw);
      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({ message: `${field} must be a valid non-negative number` });
      }

      setOps[`bodyMeasurements.${field}`] = value;
    }

    if (!Object.keys(setOps).length) {
      return res.status(400).json({ message: "No valid measurement fields provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: setOps },
      { new: true, runValidators: true }
    ).select("bodyMeasurements");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ bodyMeasurements: user.bodyMeasurements });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Promise.all([
      DietPlan.deleteMany({ user: userId }),
      MealLog.deleteMany({ user: userId }),
      ProgressLog.deleteMany({ user: userId }),
      LoginEvent.deleteMany({ user: userId }),
      ApiUsageEvent.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
