const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ApiUsageEvent = require("../models/ApiUsageEvent");

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "";
};

const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.userId || null;
  } catch {
    return null;
  }
};

const shouldSkipTracking = (req) => {
  const route = req.originalUrl.split("?")[0];
  return ["/api/health"].includes(route);
};

const trackApiUsage = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    if (shouldSkipTracking(req)) {
      return;
    }

    if (mongoose.connection.readyState !== 1) {
      return;
    }

    const route = req.originalUrl.split("?")[0];
    const eventPayload = {
      user: getUserIdFromToken(req),
      route,
      method: req.method,
      statusCode: res.statusCode,
      responseTimeMs: Date.now() - startedAt,
      ip: getClientIp(req),
      userAgent: String(req.headers["user-agent"] || ""),
    };

    ApiUsageEvent.create(eventPayload).catch(() => {
      // Never block API responses when analytics logging fails.
    });
  });

  return next();
};

module.exports = trackApiUsage;