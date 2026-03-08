const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    calories: { type: Number, required: true, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    protein: { type: Number, default: 0, min: 0 },
    fat: { type: Number, default: 0, min: 0 },
    sugar: { type: Number, default: 0, min: 0 },
    fibre: { type: Number, default: 0, min: 0 },
    sodium: { type: Number, default: 0, min: 0 },
    calcium: { type: Number, default: 0, min: 0 },
    iron: { type: Number, default: 0, min: 0 },
    vitaminC: { type: Number, default: 0, min: 0 },
    folate: { type: Number, default: 0, min: 0 },
    dietType: { type: String, enum: ["veg", "non-veg", "egg"], required: true, index: true },
    category: {
      type: String,
      enum: ["snacks", "breakfast", "main-course", "dessert"],
      required: true,
      index: true,
    },
    ingredients: { type: [String], default: [] },
    instructions: { type: [String], default: [] },
    preparationTime: { type: Number, min: 1, default: 15 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

recipeSchema.index({ name: "text" });

module.exports = mongoose.model("Recipe", recipeSchema);
