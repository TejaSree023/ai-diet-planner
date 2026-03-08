const mongoose = require("mongoose");

const progressLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weight: { type: Number, required: true, min: 1 },
    bmi: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
    caloriesConsumed: { type: Number, default: 0, min: 0 },
    waterIntake: { type: Number, default: 0, min: 0 },
    exerciseMinutes: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

progressLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("ProgressLog", progressLogSchema);
