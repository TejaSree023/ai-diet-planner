const mongoose = require("mongoose");

const loginEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    success: { type: Boolean, required: true, index: true },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

loginEventSchema.index({ createdAt: -1 });

module.exports = mongoose.model("LoginEvent", loginEventSchema);