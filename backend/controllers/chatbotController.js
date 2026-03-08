const Recipe = require("../models/Recipe");

const INTENT_HELP = {
  highProtein: "Try: 'Suggest high protein foods'",
  lowCalorie: "Try: 'Give low calorie snacks'",
  highFibre: "Try: 'Foods rich in fiber'",
  dietSpecific: "Try: 'Show vegetarian breakfast'",
  explanation: "Try: 'What is BMI?'",
};

const EXPLANATIONS = {
  bmi: "BMI (Body Mass Index) is a weight-to-height ratio used to estimate if your weight is in a healthy range. It is calculated as weight (kg) divided by height (m)^2.",
  bmr: "BMR (Basal Metabolic Rate) is the calories your body needs at rest to maintain basic functions like breathing and circulation.",
  tdee: "TDEE (Total Daily Energy Expenditure) is your estimated daily calorie burn including activity. It is based on BMR multiplied by an activity factor.",
  protein: "Protein helps with muscle repair, satiety, and overall recovery. Good daily intake depends on your goal, activity, and body weight.",
  fibre: "Fibre supports digestion, gut health, and blood sugar control. A common target is around 25 to 35 grams per day.",
};

const normalizeText = (value) => String(value || "").toLowerCase().trim();

const detectDietType = (message) => {
  const text = normalizeText(message);

  if (/\b(vegetarian|veg)\b/.test(text)) return "veg";
  if (/\b(non[-\s]?veg|non vegetarian|meat)\b/.test(text)) return "non-veg";
  if (/\b(egg|eggetarian)\b/.test(text)) return "egg";
  return "";
};

const detectCategory = (message) => {
  const text = normalizeText(message);

  if (/\bbreakfast\b/.test(text)) return "breakfast";
  if (/\bsnacks?\b/.test(text)) return "snacks";
  if (/\bdessert|sweet\b/.test(text)) return "dessert";
  if (/\bmain\s?course|lunch|dinner\b/.test(text)) return "main-course";
  return "";
};

const detectIntent = (message) => {
  const text = normalizeText(message);

  if (/\bbmi\b|\bbmr\b|\btdee\b|what is|explain/.test(text)) {
    return "explanation";
  }

  if (/high\s*protein|protein\s*foods|protein\s*rich/.test(text)) {
    return "highProtein";
  }

  if (/low\s*calorie|low\s*cal|less\s*calorie/.test(text)) {
    return "lowCalorie";
  }

  if (/high\s*fib(er|re)|fib(er|re)\s*rich/.test(text)) {
    return "highFibre";
  }

  const dietType = detectDietType(text);
  const category = detectCategory(text);
  if (dietType || category) {
    return "dietSpecific";
  }

  return "unknown";
};

const formatFoods = (foods) =>
  foods.map((food) => ({
    name: food.name,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fibre: food.fibre,
    dietType: food.dietType,
    category: food.category,
  }));

const handleExplanation = (message) => {
  const text = normalizeText(message);

  if (/\bbmi\b/.test(text)) return { reply: EXPLANATIONS.bmi, foods: [] };
  if (/\bbmr\b/.test(text)) return { reply: EXPLANATIONS.bmr, foods: [] };
  if (/\btdee\b/.test(text)) return { reply: EXPLANATIONS.tdee, foods: [] };
  if (/protein/.test(text)) return { reply: EXPLANATIONS.protein, foods: [] };
  if (/fib(er|re)/.test(text)) return { reply: EXPLANATIONS.fibre, foods: [] };

  return {
    reply:
      "I can explain BMI, BMR, TDEE, protein, and fibre. Ask something like 'What is BMI?'",
    foods: [],
  };
};

const chatbotReply = async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const intent = detectIntent(message);

    if (intent === "explanation") {
      return res.json(handleExplanation(message));
    }

    if (intent === "highProtein") {
      const foods = await Recipe.find({ protein: { $gt: 10 } })
        .sort({ protein: -1, calories: 1 })
        .limit(8)
        .lean();

      return res.json({
        reply: "Here are some high protein foods from your dataset.",
        foods: formatFoods(foods),
      });
    }

    if (intent === "lowCalorie") {
      const foods = await Recipe.find({ calories: { $lt: 150 }, category: "snacks" })
        .sort({ calories: 1, protein: -1 })
        .limit(8)
        .lean();

      return res.json({
        reply: "These are low calorie snack options from your dataset.",
        foods: formatFoods(foods),
      });
    }

    if (intent === "highFibre") {
      const foods = await Recipe.find({ fibre: { $gt: 5 } })
        .sort({ fibre: -1, calories: 1 })
        .limit(8)
        .lean();

      return res.json({
        reply: "Here are foods rich in fibre from your dataset.",
        foods: formatFoods(foods),
      });
    }

    if (intent === "dietSpecific") {
      const dietType = detectDietType(message);
      const category = detectCategory(message);
      const filter = {};

      if (dietType) filter.dietType = dietType;
      if (category) filter.category = category;

      const foods = await Recipe.find(filter)
        .sort({ protein: -1, calories: 1 })
        .limit(8)
        .lean();

      const dietLabel = dietType || "";
      const categoryLabel = category || "";
      const label = [dietLabel, categoryLabel].filter(Boolean).join(" ").trim() || "matching";

      return res.json({
        reply: `Here are ${label} foods from your dataset.`,
        foods: formatFoods(foods),
      });
    }

    return res.json({
      reply:
        `I can help with protein, low-calorie snacks, high-fibre foods, diet-specific foods, and nutrition explanations. ${INTENT_HELP.highProtein}`,
      foods: [],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  chatbotReply,
};
