const User = require("../models/User");
const DietPlan = require("../models/DietPlan");
const MealLog = require("../models/MealLog");
const ProgressLog = require("../models/ProgressLog");
const {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateDailyCalories,
} = require("../utils/calculations");
const { generatePlanByType } = require("../services/dietService");

const getGoal = (user) => user.goal || user.healthGoal || "maintenance";

const generateDietPlan = async (req, res) => {
  try {
    const { planType = "daily" } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const required = ["age", "height", "weight", "gender", "dietPreference"];
    const missing = required.filter((field) => !user[field]);

    if (missing.length) {
      return res.status(400).json({ message: `Complete profile first. Missing: ${missing.join(", ")}` });
    }

    const goal = getGoal(user);
    const bmi = calculateBMI(user.weight, user.height);
    const bmiCategory = getBMICategory(bmi);
    const bmr = calculateBMR({
      gender: user.gender,
      weight: user.weight,
      height: user.height,
      age: user.age,
    });
    const tdee = calculateTDEE({ bmr, activityLevel: user.activityLevel });
    const dailyCalories = calculateDailyCalories({ tdee, goal });

    const generated = await generatePlanByType({
      dailyCalories,
      planType,
      dietPreference: user.dietPreference,
      goal,
      allergies: user.allergies,
    });

    const dietPlan = await DietPlan.create({
      user: user._id,
      planType,
      bmi,
      bmiCategory,
      bmr,
      tdee,
      dailyCalories,
      dietPreference: user.dietPreference,
      healthGoal: goal,
      meals: generated.meals,
      days: generated.days,
    });

    return res.status(201).json(dietPlan);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyDietPlans = async (req, res) => {
  try {
    const plans = await DietPlan.find({ user: req.user.userId }).sort({ createdAt: -1 });
    return res.json(plans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDietPlanById = async (req, res) => {
  try {
    const plan = await DietPlan.findOne({ _id: req.params.id, user: req.user.userId });
    if (!plan) return res.status(404).json({ message: "Diet plan not found" });
    return res.json(plan);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const latestPlan = await DietPlan.findOne({ user: user._id }).sort({ createdAt: -1 });

    const from = new Date();
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);

    const mealLogs = await MealLog.find({ user: user._id, date: { $gte: from } }).sort({ date: 1 });
    const progressLogs = await ProgressLog.find({ user: user._id, date: { $gte: from } }).sort({ date: 1 });

    const toKey = (value) => {
      const date = new Date(value);
      date.setHours(0, 0, 0, 0);
      return date.toISOString().slice(0, 10);
    };

    // Build a stable 7-day series so the chart always has a complete timeline.
    const weekMap = new Map();
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      date.setHours(0, 0, 0, 0);
      weekMap.set(toKey(date), {
        date: date.toISOString(),
        calories: 0,
        waterIntake: 0,
        exerciseMinutes: 0,
      });
    }

    mealLogs.forEach((log) => {
      const key = toKey(log.date);
      const existing = weekMap.get(key);
      if (existing) {
        existing.calories = Number(log.calories || 0);
      }
    });

    // Progress logs represent the tracker values user enters for consumed calories.
    progressLogs.forEach((log) => {
      const key = toKey(log.date);
      const existing = weekMap.get(key);
      if (existing) {
        existing.calories = Number(log.caloriesConsumed || 0);
        existing.waterIntake = Number(log.waterIntake || 0);
        existing.exerciseMinutes = Number(log.exerciseMinutes || 0);
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayProgress = progressLogs.find((log) => toKey(log.date) === toKey(today)) || null;

    return res.json({
      user,
      latestPlan,
      weeklyCalories: Array.from(weekMap.values()),
      todayProgress,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateDietPlan,
  getMyDietPlans,
  getDietPlanById,
  getDashboardData,
};
