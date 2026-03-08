const mongoose = require("mongoose");

const apiUsageEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    route: { type: String, required: true, index: true },
    method: { type: String, required: true, index: true },
    statusCode: { type: Number, required: true },
    responseTimeMs: { type: Number, required: true },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

apiUsageEventSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ApiUsageEvent", apiUsageEventSchema);