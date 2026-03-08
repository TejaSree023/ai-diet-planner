const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

let cachedFoods = null;

const MEAL_ORDER = ["Breakfast", "Lunch", "Evening Snack", "Dinner"];

const MEAL_RANGES = {
  Breakfast: { min: 250, max: 350 },
  Lunch: { min: 400, max: 550 },
  "Evening Snack": { min: 150, max: 250 },
  Dinner: { min: 300, max: 450 },
};

const DESSERT_OR_JUNK_KEYWORDS = [
  "halwa",
  "kheer",
  "cake",
  "pastry",
  "ice cream",
  "kulfi",
  "laddu",
  "jalebi",
  "gulab jamun",
  "sweet",
  "dessert",
  "chocolate",
  "cola",
  "soda",
  "punch",
  "milkshake",
  "shake",
  "falooda",
  "fried",
  "pakoda",
  "samosa",
  "chips",
];

const BREAKFAST_KEYWORDS = [
  "oats",
  "poha",
  "idli",
  "upma",
  "dosa",
  "uttapam",
  "paratha",
  "sandwich",
  "sprout",
  "milk",
  "boiled egg",
  "omelette",
  "fruit",
  "banana",
];

const LUNCH_DINNER_KEYWORDS = [
  "dal",
  "chapati",
  "roti",
  "phulka",
  "rice",
  "khichdi",
  "rajma",
  "chole",
  "paneer",
  "sabzi",
  "vegetable",
  "sambar",
  "curry",
  "tofu",
  "fish",
  "chicken",
  "egg curry",
];

const SNACK_KEYWORDS = [
  "fruit",
  "salad",
  "sprout",
  "soup",
  "chana",
  "makhana",
  "nuts",
  "corn",
  "buttermilk",
  "lassi",
  "tea",
  "coffee",
  "coconut water",
];

const HEALTHY_PRIORITY_KEYWORDS = [
  "oats",
  "poha",
  "idli",
  "dal",
  "chapati",
  "roti",
  "vegetable",
  "sabzi",
  "salad",
  "fruit",
  "paneer",
  "sprout",
  "khichdi",
  "rajma",
  "chole",
  "sambar",
  "upma",
  "dosa",
];

const NON_VEG_KEYWORDS = [
  "chicken",
  "mutton",
  "fish",
  "prawn",
  "meat",
  "keema",
];

const EGG_KEYWORDS = ["egg", "omelette", "omelet", "boiled egg"];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const includesAnyKeyword = (text, keywords) => {
  const name = String(text || "").toLowerCase();
  return keywords.some((keyword) => name.includes(keyword));
};

const inferFoodFlags = (dishName) => {
  const lowerName = String(dishName || "").toLowerCase();

  const isNonVeg = includesAnyKeyword(lowerName, NON_VEG_KEYWORDS);
  const hasEgg = includesAnyKeyword(lowerName, EGG_KEYWORDS);

  return {
    isNonVeg,
    hasEgg,
    isVeg: !isNonVeg && !hasEgg,
  };
};

const normalizeDietPreference = (dietPreference) => {
  const value = String(dietPreference || "veg").toLowerCase().trim();

  if (["non-veg", "non veg", "nonveg", "non_veg", "nonvegetarian", "non-vegetarian"].includes(value)) {
    return "non-veg";
  }

  if (["egg", "eggetarian", "eggeterian", "eggitarian"].includes(value)) {
    return "eggetarian";
  }

  if (value === "vegan") {
    return "vegan";
  }

  return "veg";
};

const isNonVegPreferredItem = (food) => {
  return Boolean(food?.flags?.isNonVeg || food?.flags?.hasEgg);
};

const isEggPreferredItem = (food) => {
  return Boolean(food?.flags?.hasEgg && !food?.flags?.isNonVeg);
};

const isAllowedByDietPreference = (food, dietPreference) => {
  const normalizedPreference = normalizeDietPreference(dietPreference);

  if (normalizedPreference === "non-veg") {
    return true;
  }

  if (normalizedPreference === "eggetarian") {
    return !food.flags.isNonVeg;
  }

  // veg and vegan use same filter due to dataset limitations.
  return food.flags.isVeg;
};

const getMealKeywords = (mealType) => {
  if (mealType === "Breakfast") {
    return BREAKFAST_KEYWORDS;
  }

  if (mealType === "Evening Snack") {
    return SNACK_KEYWORDS;
  }

  return LUNCH_DINNER_KEYWORDS;
};

const mealTypeScore = (dishName, mealType) => {
  const keywords = getMealKeywords(mealType);
  return includesAnyKeyword(dishName, keywords) ? 1 : 0;
};

const avoidForWeightLoss = (food) => {
  if (food.freeSugar > 10) {
    return true;
  }

  if (food.fats > 20) {
    return true;
  }

  return includesAnyKeyword(food.dishName, DESSERT_OR_JUNK_KEYWORDS);
};

const healthyScore = (dishName) => {
  return includesAnyKeyword(dishName, HEALTHY_PRIORITY_KEYWORDS) ? 1 : 0;
};

const inRange = (value, min, max) => value >= min && value <= max;

const getCsvPath = () => {
  const configured = process.env.INDIAN_FOOD_CSV_PATH;
  const candidates = [
    configured,
    "../../indian_food.csv",
    "../indian_food.csv",
  ].filter(Boolean);

  for (const candidate of candidates) {
    const resolved = path.resolve(__dirname, candidate);
    if (fs.existsSync(resolved)) {
      return resolved;
    }
  }

  return path.resolve(__dirname, "../../indian_food.csv");
};

const loadIndianFoodData = async () => {
  if (cachedFoods) {
    return cachedFoods;
  }

  const csvPath = getCsvPath();

  return new Promise((resolve, reject) => {
    const foods = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        const dishName = row["Dish Name"] || "Unknown Dish";

        foods.push({
          dishName,
          calories: toNumber(row["Calories (kcal)"]),
          carbs: toNumber(row["Carbohydrates (g)"]),
          protein: toNumber(row["Protein (g)"]),
          fats: toNumber(row["Fats (g)"]),
          freeSugar: toNumber(row["Free Sugar (g)"]),
          flags: inferFoodFlags(dishName),
        });
      })
      .on("end", () => {
        cachedFoods = foods.filter((food) => food.calories > 0);
        resolve(cachedFoods);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

const sortByQuality = (pool, mealType, targetCalories) => {
  return [...pool].sort((a, b) => {
    const aMealScore = mealTypeScore(a.dishName, mealType);
    const bMealScore = mealTypeScore(b.dishName, mealType);

    if (aMealScore !== bMealScore) {
      return bMealScore - aMealScore;
    }

    const aHealthy = healthyScore(a.dishName);
    const bHealthy = healthyScore(b.dishName);
    if (aHealthy !== bHealthy) {
      return bHealthy - aHealthy;
    }

    const aDiff = Math.abs(a.calories - targetCalories);
    const bDiff = Math.abs(b.calories - targetCalories);
    return aDiff - bDiff;
  });
};

const selectMealCandidate = ({
  foods,
  mealType,
  dietPreference,
  healthGoal,
  range,
  usedNames,
  targetCalories,
}) => {
  const byPreference = foods.filter((food) => isAllowedByDietPreference(food, dietPreference));

  const byGoal =
    healthGoal === "weight-loss"
      ? byPreference.filter((food) => !avoidForWeightLoss(food))
      : byPreference;

  const primaryPool = byGoal.filter(
    (food) => inRange(food.calories, range.min, range.max) && !usedNames.has(food.dishName)
  );

  const secondaryPool = byGoal.filter((food) => !usedNames.has(food.dishName));

  const fallbackPool = byPreference.filter((food) => !usedNames.has(food.dishName));

  const isMealMatched = (food) => mealTypeScore(food.dishName, mealType) > 0;

  const strictMealPool = primaryPool.filter(isMealMatched);
  const looseMealPool = secondaryPool.filter(isMealMatched);

  const healthyPrimaryPool = primaryPool.filter((food) => healthyScore(food.dishName) > 0);
  const healthySecondaryPool = secondaryPool.filter((food) => healthyScore(food.dishName) > 0);

  const preferenceHealthyFallbackPool = fallbackPool.filter(
    (food) => isMealMatched(food) || healthyScore(food.dishName) > 0
  );

  const pool =
    strictMealPool.length > 0
      ? strictMealPool
      : healthyPrimaryPool.length > 0
        ? healthyPrimaryPool
        : primaryPool.length > 0
          ? primaryPool
          : looseMealPool.length > 0
            ? looseMealPool
            : healthySecondaryPool.length > 0
              ? healthySecondaryPool
              : secondaryPool.length > 0
                ? secondaryPool
                : preferenceHealthyFallbackPool.length > 0
                  ? preferenceHealthyFallbackPool
                  : fallbackPool;

  if (!pool.length) {
    return null;
  }

  // For non-veg users, prefer non-veg/egg options when available in the selected pool.
  const normalizedPreference = normalizeDietPreference(dietPreference);
  let prioritizedPool = pool;

  if (normalizedPreference === "non-veg") {
    const nonVegFirst = pool.filter(isNonVegPreferredItem);
    prioritizedPool = nonVegFirst.length > 0 ? nonVegFirst : pool;
  }

  if (normalizedPreference === "eggetarian") {
    const eggFirst = pool.filter(isEggPreferredItem);
    prioritizedPool = eggFirst.length > 0 ? eggFirst : pool;
  }

  const sorted = sortByQuality(prioritizedPool, mealType, targetCalories);
  return sorted[0] || null;
};

const clamp = (value, min, max) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const getServingMultiplier = (calories, range) => {
  if (!calories || calories <= 0) {
    return 1;
  }

  if (calories < range.min) {
    return clamp(range.min / calories, 1, 2);
  }

  if (calories > range.max) {
    return clamp(range.max / calories, 0.6, 1);
  }

  return 1;
};

const calculateMealTarget = (dailyCalories, mealType) => {
  const ratioMap = {
    Breakfast: 0.25,
    Lunch: 0.35,
    "Evening Snack": 0.15,
    Dinner: 0.25,
  };

  const ratioTarget = Math.round(dailyCalories * ratioMap[mealType]);
  const range = MEAL_RANGES[mealType];
  return clamp(ratioTarget, range.min, range.max);
};

const toMealResponse = (mealType, food, range) => {
  if (!food) {
    return {
      mealType,
      dishName: "No suitable item found",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    };
  }

  const servingMultiplier = getServingMultiplier(food.calories, range);
  const adjustedCalories = clamp(Math.round(food.calories * servingMultiplier), range.min, range.max);

  return {
    mealType,
    dishName:
      servingMultiplier === 1
        ? food.dishName
        : `${food.dishName} (${servingMultiplier.toFixed(1)}x serving)`,
    calories: adjustedCalories,
    protein: Number((food.protein * servingMultiplier).toFixed(2)),
    carbs: Number((food.carbs * servingMultiplier).toFixed(2)),
    fats: Number((food.fats * servingMultiplier).toFixed(2)),
  };
};

const generateDietPlanMeals = async ({
  dailyCalories,
  dietPreference,
  healthGoal,
  usedDishNames = new Set(),
}) => {
  const foodData = await loadIndianFoodData();

  if (!foodData.length) {
    return [];
  }

  const usedNames = new Set(usedDishNames);

  return MEAL_ORDER.map((mealType) => {
    const range = MEAL_RANGES[mealType];
    const targetCalories = calculateMealTarget(dailyCalories, mealType);

    const picked = selectMealCandidate({
      foods: foodData,
      mealType,
      dietPreference,
      healthGoal,
      range,
      usedNames,
      targetCalories,
    });

    if (picked) {
      usedNames.add(picked.dishName);
    }

    return toMealResponse(mealType, picked, range);
  });
};

module.exports = {
  loadIndianFoodData,
  generateDietPlanMeals,
};
