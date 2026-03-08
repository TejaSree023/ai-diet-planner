const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    mealType: { type: String, required: true },
    dishName: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
  },
  { _id: false }
);

const dayPlanSchema = new mongoose.Schema(
  {
    dayLabel: { type: String, required: true },
    meals: { type: [mealSchema], default: [] },
    alternatives: { type: [mealSchema], default: [] },
  },
  { _id: false }
);

const dietPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    bmi: { type: Number, required: true },
    bmiCategory: { type: String, required: true },
    bmr: { type: Number, required: true },
    tdee: { type: Number, required: true },
    dailyCalories: { type: Number, required: true },
    dietPreference: { type: String, required: true },
    healthGoal: { type: String, required: true },
    meals: { type: [mealSchema], default: [] },
    days: { type: [dayPlanSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DietPlan", dietPlanSchema);
