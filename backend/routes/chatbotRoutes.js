const express = require("express");
const auth = require("../middleware/auth");
const { chatbotReply } = require("../controllers/chatbotController");

const router = express.Router();

router.post("/", auth, chatbotReply);

module.exports = router;
