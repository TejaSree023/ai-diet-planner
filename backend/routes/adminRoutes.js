const express = require("express");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User");
const LoginEvent = require("../models/LoginEvent");
const ApiUsageEvent = require("../models/ApiUsageEvent");

const router = express.Router();

router.post("/bootstrap", async (req, res) => {
  try {
    const secret = String(req.body?.secret || "");
    const email = String(req.body?.email || "").toLowerCase().trim();

    if (!secret || !email) {
      return res.status(400).json({ message: "Secret and email are required" });
    }

    if (secret !== process.env.ADMIN_BOOTSTRAP_SECRET) {
      return res.status(403).json({ message: "Invalid bootstrap secret" });
    }

    const existingAdmin = await User.findOne({ isAdmin: true }).select("_id");
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isAdmin: true },
      { new: true }
    ).select("name email isAdmin");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "Admin bootstrap completed", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/usage", auth, adminAuth, async (req, res) => {
  try {
    const days = Math.max(Number(req.query.days || 7), 1);

    const now = new Date();
    const periodStart = new Date(now);
    periodStart.setDate(periodStart.getDate() - (days - 1));
    periodStart.setHours(0, 0, 0, 0);

    const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersInPeriod,
      distinctUsersInPeriod,
      distinctUsers24h,
      topRoutes,
      recentActiveUsers,
      loginEvents,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: periodStart } }),
      ApiUsageEvent.distinct("user", { createdAt: { $gte: periodStart }, user: { $ne: null } }),
      ApiUsageEvent.distinct("user", { createdAt: { $gte: since24h }, user: { $ne: null } }),
      ApiUsageEvent.aggregate([
        { $match: { createdAt: { $gte: periodStart } } },
        {
          $group: {
            _id: { route: "$route", method: "$method" },
            requests: { $sum: 1 },
          },
        },
        { $sort: { requests: -1 } },
        { $limit: 10 },
      ]),
      ApiUsageEvent.aggregate([
        { $match: { createdAt: { $gte: periodStart }, user: { $ne: null } } },
        {
          $group: {
            _id: "$user",
            lastSeenAt: { $max: "$createdAt" },
            requestCount: { $sum: 1 },
          },
        },
        { $sort: { lastSeenAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 0,
            userId: "$user._id",
            name: "$user.name",
            email: "$user.email",
            lastSeenAt: 1,
            requestCount: 1,
          },
        },
      ]),
      LoginEvent.aggregate([
        { $match: { createdAt: { $gte: periodStart } } },
        {
          $group: {
            _id: "$success",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const loginStats = loginEvents.reduce(
      (acc, item) => {
        if (item._id === true) {
          acc.success += item.count;
        } else {
          acc.failed += item.count;
        }
        return acc;
      },
      { success: 0, failed: 0 }
    );

    return res.json({
      periodDays: days,
      summary: {
        totalUsers,
        newUsersInPeriod,
        dailyActiveUsers: distinctUsersInPeriod.length,
        activeUsersLast24Hours: distinctUsers24h.length,
        loginSuccessCount: loginStats.success,
        loginFailureCount: loginStats.failed,
      },
      topRoutes: topRoutes.map((item) => ({
        route: item._id.route,
        method: item._id.method,
        requests: item.requests,
      })),
      recentActiveUsers,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 200);
    const days = Math.max(Number(req.query.days || 0), 0);
    const q = String(req.query.q || "").trim();

    const filter = {};

    if (days > 0) {
      const since = new Date();
      since.setDate(since.getDate() - (days - 1));
      since.setHours(0, 0, 0, 0);
      filter.createdAt = { $gte: since };
    }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("name email isAdmin createdAt lastLoginAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.json({
      total: users.length,
      query: { limit, days, q },
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/users/:id", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;