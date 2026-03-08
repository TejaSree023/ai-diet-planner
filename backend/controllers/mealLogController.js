const MealLog = require("../models/MealLog");

const normalizeDate = (inputDate) => {
  const date = new Date(inputDate || Date.now());
  date.setHours(0, 0, 0, 0);
  return date;
};

const upsertMealLog = async (req, res) => {
  try {
    const date = normalizeDate(req.body.date);
    const foodItems = Array.isArray(req.body.foodItems) ? req.body.foodItems : [];

    const calories = foodItems.reduce((sum, item) => sum + Number(item.calories || 0), 0);

    const log = await MealLog.findOneAndUpdate(
      { user: req.user.userId, date },
      { user: req.user.userId, date, foodItems, calories },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json(log);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getMealLog = async (req, res) => {
  try {
    const date = normalizeDate(req.query.date);
    const log = await MealLog.findOne({ user: req.user.userId, date });
    return res.json(log || { user: req.user.userId, foodItems: [], calories: 0, date });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMealSummary = async (req, res) => {
  try {
    const days = Number(req.query.days || 7);
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    from.setHours(0, 0, 0, 0);

    const logs = await MealLog.find({ user: req.user.userId, date: { $gte: from } }).sort({ date: 1 });

    const data = logs.map((log) => ({
      date: log.date,
      calories: log.calories,
      protein: log.foodItems.reduce((sum, f) => sum + Number(f.protein || 0), 0),
      carbs: log.foodItems.reduce((sum, f) => sum + Number(f.carbs || 0), 0),
      fats: log.foodItems.reduce((sum, f) => sum + Number(f.fats || 0), 0),
    }));

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { upsertMealLog, getMealLog, getMealSummary };
