const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const LoginEvent = require("../models/LoginEvent");

const router = express.Router();

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const getClientIp = (req) => {
  const headers = req.headers || {};
  const forwarded = headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "";
};

const recordLoginEvent = (payload) => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  LoginEvent.create(payload).catch(() => {
    // Ignore telemetry errors to avoid blocking auth flow.
  });
};

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      activityLevel,
      dietPreference,
      goal,
      allergies,
      wakeTime,
      sleepTime,
      reminderSettings,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      activityLevel,
      dietPreference,
      goal,
      healthGoal: goal,
      allergies: Array.isArray(allergies) ? allergies : [],
      wakeTime,
      sleepTime,
      reminderSettings: {
        water: reminderSettings?.water !== false,
        meals: reminderSettings?.meals !== false,
        weighIn: Boolean(reminderSettings?.weighIn),
      },
    });
    const token = signToken(user._id.toString());

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNormalized = String(email || "").toLowerCase().trim();
    const ip = getClientIp(req);
    const userAgent = String((req.headers || {})["user-agent"] || "");

    if (!email || !password) {
      recordLoginEvent({
        email: emailNormalized,
        success: false,
        ip,
        userAgent,
        reason: "missing_credentials",
      });
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: emailNormalized });
    if (!user) {
      recordLoginEvent({
        email: emailNormalized,
        success: false,
        ip,
        userAgent,
        reason: "user_not_found",
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      recordLoginEvent({
        user: user._id,
        email: user.email,
        success: false,
        ip,
        userAgent,
        reason: "invalid_password",
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    recordLoginEvent({
      user: user._id,
      email: user.email,
      success: true,
      ip,
      userAgent,
      reason: "login_success",
    });

    const token = signToken(user._id.toString());

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
