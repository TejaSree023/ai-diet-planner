const mongoose = require("mongoose");

const mealItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, default: 0, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    fats: { type: Number, default: 0, min: 0 },
    mealType: { type: String, enum: ["Breakfast", "Lunch", "Evening Snack", "Dinner"], required: true },
  },
  { _id: false }
);

const mealLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodItems: { type: [mealItemSchema], default: [] },
    calories: { type: Number, default: 0, min: 0 },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

mealLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("MealLog", mealLogSchema);
