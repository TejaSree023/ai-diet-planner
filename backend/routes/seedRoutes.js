const express = require("express");
const auth = require("../middleware/auth");
const Food = require("../models/Food");
const Recipe = require("../models/Recipe");
const { loadIndianFoodData } = require("../utils/foodData");
const sampleRecipes = require("../data/sampleRecipes");

const router = express.Router();

const pickCategory = (name) => {
  const lower = String(name || "").toLowerCase();
  if (/(idli|poha|oats|upma|dosa|paratha|sandwich)/.test(lower)) return "breakfast";
  if (/(soup|salad|fruit|tea|coffee|chana|sprout)/.test(lower)) return "snack";
  if (/(dal|curry|rice|roti|chapati|khichdi|pulao)/.test(lower)) return "lunch";
  return "general";
};

const pickDietType = (name) => {
  const lower = String(name || "").toLowerCase();
  if (/(chicken|mutton|fish|prawn|meat)/.test(lower)) return "non-veg";
  if (/egg/.test(lower)) return "eggetarian";
  return "veg";
};

router.post("/sample-data", auth, async (req, res) => {
  try {
    const csvFoods = await loadIndianFoodData();

    const foodDocs = csvFoods.map((food) => ({
      name: food.dishName,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      freeSugar: food.freeSugar,
      category: pickCategory(food.dishName),
      dietType: pickDietType(food.dishName),
      tags: [],
    }));

    await Food.deleteMany({});
    await Recipe.deleteMany({});
    await Food.insertMany(foodDocs, { ordered: false });
    await Recipe.insertMany(sampleRecipes, { ordered: false });

    return res.json({
      foodsInserted: foodDocs.length,
      recipesInserted: sampleRecipes.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
