const makeRecipe = ({
  name,
  dietType,
  category,
  ingredients,
  preparationTime,
  calories,
  protein,
  carbs,
  fat,
  tags,
}) => ({
  name,
  ingredients,
  instructions: [
    "Prep ingredients and keep spices ready.",
    "Cook on medium heat with minimal oil and stir regularly.",
    "Plate hot and garnish before serving.",
  ],
  preparationTime,
  calories,
  protein,
  carbs,
  category,
  fat,
  dietType,
  tags,
});

const sideVariants = [
  "with Chapati",
  "with Brown Rice",
  "with Millet",
  "with Quinoa",
  "Bowl",
];

const vegBases = [
  { name: "Paneer Bhurji", ingredients: ["paneer", "onion", "tomato", "spices"] },
  { name: "Chole Masala", ingredients: ["chickpeas", "onion", "tomato", "spices"] },
  { name: "Rajma Curry", ingredients: ["kidney beans", "onion", "tomato", "spices"] },
  { name: "Moong Dal Tadka", ingredients: ["moong dal", "garlic", "cumin", "spices"] },
  { name: "Vegetable Pulao", ingredients: ["rice", "mixed vegetables", "peas", "spices"] },
  { name: "Palak Paneer", ingredients: ["spinach", "paneer", "garlic", "spices"] },
  { name: "Aloo Gobi", ingredients: ["potato", "cauliflower", "turmeric", "spices"] },
  { name: "Soya Chunk Curry", ingredients: ["soya chunks", "onion", "tomato", "spices"] },
  { name: "Mixed Veg Korma", ingredients: ["mixed vegetables", "curd", "cashew", "spices"] },
  { name: "Dal Khichdi", ingredients: ["rice", "lentils", "ghee", "spices"] },
];

const nonVegBases = [
  { name: "Grilled Chicken", ingredients: ["chicken breast", "ginger garlic", "pepper", "spices"] },
  { name: "Chicken Curry", ingredients: ["chicken", "onion", "tomato", "spices"] },
  { name: "Fish Masala", ingredients: ["fish", "mustard", "onion", "spices"] },
  { name: "Prawn Stir Fry", ingredients: ["prawns", "garlic", "capsicum", "spices"] },
  { name: "Mutton Stew", ingredients: ["mutton", "onion", "ginger", "spices"] },
  { name: "Chicken Keema", ingredients: ["minced chicken", "peas", "onion", "spices"] },
  { name: "Tandoori Chicken", ingredients: ["chicken", "hung curd", "chili", "spices"] },
  { name: "Fish Curry", ingredients: ["fish", "coconut", "onion", "spices"] },
  { name: "Chicken Saute", ingredients: ["chicken", "broccoli", "garlic", "spices"] },
  { name: "Pepper Chicken", ingredients: ["chicken", "black pepper", "onion", "spices"] },
];

const eggSnackBases = [
  { name: "Egg Bhurji", ingredients: ["eggs", "onion", "tomato", "spices"] },
  { name: "Boiled Egg Chaat", ingredients: ["boiled eggs", "onion", "tomato", "chaat masala"] },
  { name: "Masala Omelette", ingredients: ["eggs", "onion", "chili", "spices"] },
  { name: "Egg Mayo Sandwich", ingredients: ["eggs", "hung curd", "bread", "pepper"] },
  { name: "Egg Salad", ingredients: ["eggs", "lettuce", "cucumber", "lemon"] },
  { name: "Egg Roll", ingredients: ["eggs", "whole wheat wrap", "onion", "capsicum"] },
  { name: "Egg Muffin", ingredients: ["eggs", "spinach", "cheese", "pepper"] },
  { name: "Scrambled Egg Cup", ingredients: ["eggs", "milk", "herbs", "pepper"] },
  { name: "Egg Tikka Bites", ingredients: ["boiled eggs", "hung curd", "chili", "spices"] },
  { name: "Egg Avocado Toast", ingredients: ["eggs", "whole grain bread", "avocado", "pepper"] },
];

const buildRecipes = ({
  bases,
  dietType,
  category,
  tags,
  caloriesStart,
  proteinStart,
  carbsStart,
  fatsStart,
  timeStart,
}) => {
  const recipes = [];
  let counter = 0;

  for (const base of bases) {
    for (const side of sideVariants) {
      counter += 1;
      recipes.push(
        makeRecipe({
          name: `${base.name} ${side}`,
          dietType,
          category,
          ingredients: [...base.ingredients, side.replace("with ", "")],
          preparationTime: timeStart + (counter % 5) * 3,
          calories: caloriesStart + (counter % 10) * 18,
          protein: proteinStart + (counter % 8) * 2,
          carbs: carbsStart + (counter % 7) * 3,
          fat: fatsStart + (counter % 6) * 1.5,
          tags,
        })
      );
    }
  }

  return recipes;
};

const vegRecipes = buildRecipes({
  bases: vegBases,
  dietType: "veg",
  category: "main-course",
  tags: ["veg", "balanced", "high fiber"],
  caloriesStart: 280,
  proteinStart: 12,
  carbsStart: 28,
  fatsStart: 8,
  timeStart: 18,
});

const nonVegRecipes = buildRecipes({
  bases: nonVegBases,
  dietType: "non-veg",
  category: "main-course",
  tags: ["non-veg", "high protein", "muscle gain"],
  caloriesStart: 320,
  proteinStart: 24,
  carbsStart: 14,
  fatsStart: 10,
  timeStart: 20,
});

const eggSnackRecipes = buildRecipes({
  bases: eggSnackBases,
  dietType: "non-veg",
  category: "snacks",
  tags: ["egg", "snack", "quick"],
  caloriesStart: 180,
  proteinStart: 11,
  carbsStart: 8,
  fatsStart: 7,
  timeStart: 10,
});

module.exports = [...vegRecipes, ...nonVegRecipes, ...eggSnackRecipes];
