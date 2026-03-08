import api from "../api/client";

export const saveMealLog = async (payload) => {
  const { data } = await api.post("/meal-logs", payload);
  return data;
};

export const fetchMealLog = async (date) => {
  const { data } = await api.get("/meal-logs", { params: { date } });
  return data;
};

export const fetchMealSummary = async (days = 7) => {
  const { data } = await api.get("/meal-logs/summary", { params: { days } });
  return data;
};

export const saveProgress = async (payload) => {
  const { data } = await api.post("/progress", payload);
  return data;
};

export const fetchProgress = async (days = 30) => {
  const { data } = await api.get("/progress", { params: { days } });
  return data;
};
