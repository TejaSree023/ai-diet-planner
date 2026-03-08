import api from "../api/client";

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/profile/me");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/profile/me", payload);
  return data;
};

export const updateMeasurements = async (payload) => {
  const { data } = await api.patch("/profile/measurements", payload);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await api.delete("/profile/me");
  return data;
};

export const exportMyData = async () => {
  const { data } = await api.get("/profile/export-data");
  return data;
};

export const clearAllLogs = async () => {
  const { data } = await api.delete("/profile/logs");
  return data;
};
