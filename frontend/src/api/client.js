import axios from "axios";

const envUrl =
  import.meta.env.VITE_API_URL?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim();

// In production, VITE_API_URL is required.
// In local development, fallback to localhost.
const normalizedBaseUrl = (
  envUrl || (import.meta.env.DEV ? "http://localhost:5000" : "")
).replace(/\/+$/, "");

const baseURL = normalizedBaseUrl.replace(/\/api$/i, "");

if (!baseURL) {
  throw new Error(
    "Missing VITE_API_URL. Set it in Vercel (Project Settings → Environment Variables)."
  );
}

const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { baseURL };
export default api;