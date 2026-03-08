const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.userId).select("isAdmin");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = adminAuth;