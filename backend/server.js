const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const trackApiUsage = require("./middleware/trackApiUsage");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const parseAllowedOrigins = () => {
  const raw = process.env.FRONTEND_URL || "http://localhost:5173";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
};

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = parseAllowedOrigins();

      // Allow tools like Postman (no origin) and local Vite dev ports.
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:5\d{3}$/.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS blocked for this origin"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(trackApiUsage);

app.get("/", (req, res) => {
  res.json({
    message: "AI Diet Planner backend is running",
    health: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ message: "AI Diet Planner API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/diet-plans", require("./routes/dietRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/recipes", require("./routes/recipeRoutes"));
app.use("/api/meal-logs", require("./routes/mealLogRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/seed", require("./routes/seedRoutes"));
app.use("/api/generate-diet", require("./routes/generateDietRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
