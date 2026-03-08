import api from "../api/client";

export const fetchRecipes = async (params = {}) => {
  const { data } = await api.get("/recipes", { params });
  return data;
};

export const createRecipe = async (payload) => {
  const { data } = await api.post("/recipes", payload);
  return data;
};

export const toggleFavoriteRecipe = async (recipeId) => {
  const { data } = await api.post(`/recipes/${recipeId}/favorite`);
  return data;
};

export const fetchFavoriteRecipes = async () => {
  const { data } = await api.get("/recipes/favorites");
  return data;
};
