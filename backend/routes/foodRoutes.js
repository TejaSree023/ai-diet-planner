const express = require("express");
const auth = require("../middleware/auth");
const Food = require("../models/Food");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const { q, category, dietType, limit } = req.query;
    const filter = {};

    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;
    if (dietType) filter.dietType = dietType;

    let query = Food.find(filter).sort({ name: 1 });

    // By default return full dataset; caller can still pass ?limit=... when needed.
    const parsedLimit = Number(limit);
    if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
      query = query.limit(Math.floor(parsedLimit));
    }

    const foods = await query;
    return res.json(foods);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
