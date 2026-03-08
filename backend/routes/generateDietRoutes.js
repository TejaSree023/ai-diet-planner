const express = require("express");
const { generateDiet } = require("../controllers/generateDietController");

const router = express.Router();

router.post("/", generateDiet);

module.exports = router;
