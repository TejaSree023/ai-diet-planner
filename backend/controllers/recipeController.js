const Recipe = require("../models/Recipe");
const User = require("../models/User");

const PAGE_SIZE = 50;

const normalizeDietType = (value) => {
  const raw = String(value || "").toLowerCase().trim();
  if (["non-veg", "non veg", "nonveg", "non_veg", "nonvegetarian", "non-vegetarian"].includes(raw)) {
    return "non-veg";
  }
  if (["egg", "eggetarian", "eggitarian"].includes(raw)) {
    return "egg";
  }
  if (raw === "veg") {
    return "veg";
  }
  return "";
};

const normalizeCategory = (value) => {
  const raw = String(value || "").toLowerCase().trim();
  if (["main-course", "main course", "main_course", "maincourse", "lunch", "dinner"].includes(raw)) {
    return "main-course";
  }
  if (["breakfast", "snacks", "snack", "dessert"].includes(raw)) {
    return raw === "snack" ? "snacks" : raw;
  }
  return "";
};

const listRecipes = async (req, res) => {
  try {
    const { dietType, category, search, minProtein, maxCalories, minFibre } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);

    const filter = {};
    const normalizedDietType = normalizeDietType(dietType);
    const normalizedCategory = normalizeCategory(category);

    // Only add to filter if non-empty
    if (dietType && normalizedDietType) filter.dietType = normalizedDietType;
    if (category && normalizedCategory) filter.category = normalizedCategory;
    if (search) filter.name = { $regex: String(search).trim(), $options: "i" };

    if (minProtein !== undefined) {
      filter.protein = { ...(filter.protein || {}), $gte: Math.max(Number(minProtein) || 0, 0) };
    }
    if (maxCalories !== undefined) {
      filter.calories = { ...(filter.calories || {}), $lte: Math.max(Number(maxCalories) || 0, 0) };
    }
    if (minFibre !== undefined) {
      filter.fibre = { ...(filter.fibre || {}), $gte: Math.max(Number(minFibre) || 0, 0) };
    }

    const total = await Recipe.countDocuments(filter);
    const items = await Recipe.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    return res.json({
      items,
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.max(Math.ceil(total / PAGE_SIZE), 1),
      hasMore: page * PAGE_SIZE < total,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      fat: req.body.fat ?? req.body.fats ?? 0,
      dietType: normalizeDietType(req.body.dietType) || "veg",
      category: normalizeCategory(req.body.category) || "main-course",
    };

    const recipe = await Recipe.create(payload);
    return res.status(201).json(recipe);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const toggleFavoriteRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const recipeId = req.params.id;
    const has = user.favoriteRecipes.some((id) => id.toString() === recipeId);

    if (has) {
      user.favoriteRecipes = user.favoriteRecipes.filter((id) => id.toString() !== recipeId);
    } else {
      user.favoriteRecipes.push(recipeId);
    }

    await user.save();
    return res.json({ favoriteRecipes: user.favoriteRecipes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("favoriteRecipes");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user.favoriteRecipes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listRecipes,
  createRecipe,
  toggleFavoriteRecipe,
  getFavoriteRecipes,
};
