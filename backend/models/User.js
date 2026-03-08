const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    age: { type: Number, min: 1 },
    height: { type: Number, min: 1 },
    weight: { type: Number, min: 1 },
    gender: { type: String, enum: ["male", "female", "other"] },
    activityLevel: {
      type: String,
      enum: ["sedentary", "moderate", "active"],
      default: "sedentary",
    },
    dietPreference: { type: String, enum: ["veg", "non-veg", "vegan", "eggetarian"] },
    goal: {
      type: String,
      enum: ["weight-loss", "weight-gain", "maintenance", "muscle-gain"],
      default: "maintenance",
    },
    healthGoal: {
      type: String,
      enum: ["weight-loss", "weight-gain", "maintenance", "muscle-gain"],
      default: "maintenance",
    },
    allergies: { type: [String], default: [] },
    bodyMeasurements: {
      neck: { type: Number, min: 0, default: null },
      chest: { type: Number, min: 0, default: null },
      waist: { type: Number, min: 0, default: null },
      hips: { type: Number, min: 0, default: null },
    },
    wakeTime: { type: String, default: "07:00" },
    sleepTime: { type: String, default: "23:00" },
    reminderSettings: {
      water: { type: Boolean, default: true },
      meals: { type: Boolean, default: true },
      weighIn: { type: Boolean, default: false },
    },
    isAdmin: { type: Boolean, default: false, index: true },
    lastLoginAt: { type: Date, default: null },
    favoriteRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
