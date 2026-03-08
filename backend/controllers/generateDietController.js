const Recipe = require("../models/Recipe");

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const getActivityFactor = (activityLevel) => {
  const key = String(activityLevel || "").toLowerCase().trim();
  const map = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
    very_active: 1.9,
    veryactive: 1.9,
  };
  return map[key] || 1.2;
};

const getGoalAdjustment = (goal) => {
  const key = String(goal || "").toLowerCase().trim();
  if (key === "weight_loss" || key === "weight-loss") return -500;
  if (key === "muscle_gain" || key === "muscle-gain") return 300;
  return 0;
};

const calculateBMR = ({ height, weight, age, gender }) => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  const key = String(gender || "").toLowerCase().trim();

  if (key === "male") return base + 5;
  if (key === "female") return base - 161;
  return base - 78;
};

const calculateTargets = ({ dailyCalories }) => {
  return {
    Breakfast: Math.round(dailyCalories * 0.25),
    Lunch: Math.round(dailyCalories * 0.35),
    Snack: Math.round(dailyCalories * 0.15),
    Dinner: Math.round(dailyCalories * 0.25),
  };
};

const pickBestRecipe = async ({ targetCalories, category }) => {
  const candidates = await Recipe.find({ category }).limit(300).lean();
  if (!candidates.length) return null;

  const targetProtein = (targetCalories * 0.25) / 4;
  const targetCarbs = (targetCalories * 0.5) / 4;
  const targetFat = (targetCalories * 0.25) / 9;

  const scored = candidates
    .map((recipe) => {
      const calDiff = Math.abs((recipe.calories || 0) - targetCalories);
      const proteinDiff = Math.abs((recipe.protein || 0) - targetProtein);
      const carbsDiff = Math.abs((recipe.carbs || 0) - targetCarbs);
      const fatDiff = Math.abs((recipe.fat || 0) - targetFat);
      const score = calDiff + proteinDiff * 3 + carbsDiff * 1.5 + fatDiff * 2;

      return { recipe, score };
    })
    .sort((a, b) => a.score - b.score);

  return scored[0]?.recipe || null;
};

const generateDiet = async (req, res) => {
  try {
    const {
      height,
      weight,
      age,
      gender,
      activityLevel,
      goal,
    } = req.body;

    const normalized = {
      height: toNumber(height),
      weight: toNumber(weight),
      age: toNumber(age),
      gender: String(gender || "").toLowerCase().trim(),
      activityLevel,
      goal,
    };

    if (!normalized.height || !normalized.weight || !normalized.age || !normalized.gender) {
      return res.status(400).json({ message: "height, weight, age and gender are required" });
    }

    const bmr = calculateBMR(normalized);
    const tdee = bmr * getActivityFactor(normalized.activityLevel);
    const dailyCalories = Math.max(1200, Math.round(tdee + getGoalAdjustment(normalized.goal)));

    const mealTargets = calculateTargets({ dailyCalories });

    const breakfast = await pickBestRecipe({
      targetCalories: mealTargets.Breakfast,
      category: "breakfast",
    });
    const lunch = await pickBestRecipe({
      targetCalories: mealTargets.Lunch,
      category: "main-course",
    });
    const snack = await pickBestRecipe({
      targetCalories: mealTargets.Snack,
      category: "snacks",
    });
    const dinner = await pickBestRecipe({
      targetCalories: mealTargets.Dinner,
      category: "main-course",
    });

    const shapeMeal = (mealName, recipe, target) => ({
      meal: mealName,
      targetCalories: target,
      recipe: recipe
        ? {
            name: recipe.name,
            calories: recipe.calories,
            protein: recipe.protein,
            carbs: recipe.carbs,
            fat: recipe.fat,
          }
        : null,
    });

    return res.json({
      summary: {
        bmr: Number(bmr.toFixed(2)),
        tdee: Number(tdee.toFixed(2)),
        dailyCalories,
      },
      plan: {
        Breakfast: shapeMeal("Breakfast", breakfast, mealTargets.Breakfast),
        Lunch: shapeMeal("Lunch", lunch, mealTargets.Lunch),
        Snack: shapeMeal("Snack", snack, mealTargets.Snack),
        Dinner: shapeMeal("Dinner", dinner, mealTargets.Dinner),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateDiet,
};
