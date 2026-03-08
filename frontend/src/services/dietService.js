import api from "../api/client";

export const generatePlan = async (planType) => {
  const { data } = await api.post("/diet-plans/generate", { planType });
  return data;
};

export const fetchMyPlans = async () => {
  const { data } = await api.get("/diet-plans/mine");
  return data;
};

export const fetchDashboard = async () => {
  const { data } = await api.get("/diet-plans/dashboard");
  return data;
};
