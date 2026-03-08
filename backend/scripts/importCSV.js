const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Recipe = require("../models/Recipe");

dotenv.config();

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeDietType = (value, dishName) => {
  const raw = String(value || "").toLowerCase().trim();
  if (["veg", "vegetarian"].includes(raw)) return "veg";
  if (["non-veg", "non veg", "nonveg", "non_veg", "nonvegetarian", "non-vegetarian"].includes(raw)) {
    return "non-veg";
  }
  if (["egg", "eggetarian", "eggitarian"].includes(raw)) return "egg";

  const name = String(dishName || "").toLowerCase();
  if (/\begg|omelette|omelet|boiled egg\b/.test(name)) return "egg";
  if (/\b(chicken|mutton|fish|prawn|meat|keema|salami|bacon)\b/.test(name)) return "non-veg";
  return "veg";
};

const normalizeCategory = (value, dishName) => {
  const raw = String(value || "").toLowerCase().trim();
  if (["snacks", "snack"].includes(raw)) return "snacks";
  if (["breakfast"].includes(raw)) return "breakfast";
  if (["main-course", "main course", "main_course", "maincourse", "lunch", "dinner"].includes(raw)) {
    return "main-course";
  }
  if (["dessert", "sweets", "sweet"].includes(raw)) return "dessert";

  const name = String(dishName || "").toLowerCase();
  if (/(tea|coffee|milkshake|porridge|omelette|omelet|idli|dosa|poha|upma|paratha|cheela|sandwich)/.test(name)) {
    return "breakfast";
  }
  if (/(soup|salad|raita|pakora|pakoda|cutlet|vada|samosa|chutney|snack|biscuit|cookie)/.test(name)) {
    return "snacks";
  }
  if (/(kheer|halwa|ice cream|souffle|pudding|cake|pastry|burfi|ladoo|jamun|dessert|sweet)/.test(name)) {
    return "dessert";
  }
  return "main-course";
};

const parseRow = (row) => {
  const name = String(row["Dish Name"] || "").trim();
  if (!name) return null;

  return {
    name,
    calories: toNumber(row["Calories (kcal)"]),
    carbs: toNumber(row["Carbohydrates (g)"]),
    protein: toNumber(row["Protein (g)"]),
    fat: toNumber(row["Fats (g)"]),
    sugar: toNumber(row["Free Sugar (g)"]),
    fibre: toNumber(row["Fibre (g)"]),
    sodium: toNumber(row["Sodium (mg)"]),
    calcium: toNumber(row["Calcium (mg)"]),
    iron: toNumber(row["Iron (mg)"]),
    vitaminC: toNumber(row["Vitamin C (mg)"]),
    folate: toNumber(row["Folate (µg)"]),
    dietType: normalizeDietType(row["Diet type"], name),
    category: normalizeCategory(row.Category, name),
    ingredients: [],
    instructions: [],
    preparationTime: 15,
    tags: [],
  };
};

const readCsv = (csvPath) => {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        const parsed = parseRow(row);
        if (parsed) rows.push(parsed);
      })
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
};

const run = async () => {
  const configuredPath = process.env.INDIAN_FOOD_CSV_PATH;
  const candidates = configuredPath
    ? [
        path.resolve(__dirname, configuredPath),
        path.resolve(__dirname, "../", configuredPath),
        path.resolve(process.cwd(), configuredPath),
      ]
    : [path.resolve(__dirname, "../../indian_food.csv")];

  const csvPath = candidates.find((candidate) => fs.existsSync(candidate));

  if (!csvPath) {
    throw new Error(`CSV not found. Checked paths: ${candidates.join(", ")}`);
  }

  await connectDB();

  const rows = await readCsv(csvPath);
  if (!rows.length) {
    throw new Error("No rows parsed from CSV");
  }

  await Recipe.deleteMany({});
  await Recipe.insertMany(rows, { ordered: false });

  console.log(`Imported ${rows.length} recipes into recipes collection`);
  process.exit(0);
};

run().catch((error) => {
  console.error("CSV import failed:", error.message);
  process.exit(1);
});
