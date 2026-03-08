const express = require("express");
const auth = require("../middleware/auth");
const {
  listRecipes,
  createRecipe,
  toggleFavoriteRecipe,
  getFavoriteRecipes,
} = require("../controllers/recipeController");

const router = express.Router();

router.get("/", listRecipes);
router.post("/", auth, createRecipe);
router.get("/favorites", auth, getFavoriteRecipes);
router.post("/:id/favorite", auth, toggleFavoriteRecipe);

module.exports = router;
