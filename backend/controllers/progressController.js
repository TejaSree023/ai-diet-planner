const ProgressLog = require("../models/ProgressLog");
const { calculateBMI } = require("../utils/calculations");

const normalizeDate = (inputDate) => {
  const date = new Date(inputDate || Date.now());
  date.setHours(0, 0, 0, 0);
  return date;
};

const addProgressLog = async (req, res) => {
  try {
    const date = normalizeDate(req.body.date);
    const weight = Number(req.body.weight);
    const height = Number(req.body.height);

    if (!weight || !height) {
      return res.status(400).json({ message: "Weight and height are required" });
    }

    const bmi = calculateBMI(weight, height);

    const log = await ProgressLog.findOneAndUpdate(
      { user: req.user.userId, date },
      {
        user: req.user.userId,
        date,
        weight,
        bmi,
        caloriesConsumed: Number(req.body.caloriesConsumed || 0),
        waterIntake: Number(req.body.waterIntake || 0),
        exerciseMinutes: Number(req.body.exerciseMinutes || 0),
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json(log);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getProgressLogs = async (req, res) => {
  try {
    const days = Number(req.query.days || 30);
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    from.setHours(0, 0, 0, 0);

    const logs = await ProgressLog.find({ user: req.user.userId, date: { $gte: from } }).sort({ date: 1 });
    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addProgressLog, getProgressLogs };
