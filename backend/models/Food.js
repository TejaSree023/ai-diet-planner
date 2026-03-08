const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, default: 0, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    fats: { type: Number, default: 0, min: 0 },
    freeSugar: { type: Number, default: 0, min: 0 },
    category: {
      type: String,
      enum: ["breakfast", "lunch", "snack", "dinner", "general"],
      default: "general",
    },
    dietType: { type: String, enum: ["veg", "non-veg", "eggetarian"], default: "veg" },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
