const { generateDietPlanMeals } = require("../utils/foodData");

const getPlanDays = (planType) => {
  if (planType === "monthly") return 30;
  if (planType === "weekly") return 7;
  return 1;
};

const getDayLabel = (index, planType) => {
  if (planType === "daily") return "Today";
  return `Day ${index + 1}`;
};

const normalizeAllergies = (allergies) => {
  if (!Array.isArray(allergies)) return [];
  return allergies.map((item) => String(item).toLowerCase().trim()).filter(Boolean);
};

const removeAllergens = (meals, allergies) => {
  if (!allergies.length) {
    return meals;
  }

  return meals.filter((meal) => {
    const name = String(meal.dishName || "").toLowerCase();
    return !allergies.some((allergy) => name.includes(allergy));
  });
};

const suggestAlternatives = async ({
  dailyCalories,
  dietPreference,
  goal,
  allergies,
  avoidDishNames,
}) => {
  const altMeals = await generateDietPlanMeals({
    dailyCalories,
    dietPreference,
    healthGoal: goal,
    usedDishNames: avoidDishNames,
  });

  return removeAllergens(altMeals, allergies).slice(0, 2);
};

const generatePlanByType = async ({
  dailyCalories,
  planType,
  dietPreference,
  goal,
  allergies,
}) => {
  const days = [];
  const dayCount = getPlanDays(planType);
  const normalizedAllergies = normalizeAllergies(allergies);
  const usedDishNames = new Set();

  for (let index = 0; index < dayCount; index += 1) {
    const meals = await generateDietPlanMeals({
      dailyCalories,
      dietPreference,
      healthGoal: goal,
      usedDishNames,
    });

    const safeMeals = removeAllergens(meals, normalizedAllergies);
    const alternatives = await suggestAlternatives({
      dailyCalories,
      dietPreference,
      goal,
      allergies: normalizedAllergies,
      avoidDishNames: new Set([...usedDishNames, ...safeMeals.map((m) => m.dishName)]),
    });

    safeMeals.forEach((meal) => usedDishNames.add(meal.dishName));

    days.push({
      dayLabel: getDayLabel(index, planType),
      meals: safeMeals,
      alternatives,
    });
  }

  return {
    meals: days[0]?.meals || [],
    days,
  };
};

module.exports = {
  generatePlanByType,
};
