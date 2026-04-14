import axios from "axios";

const envUrl = import.meta.env.VITE_API_URL?.trim();

// In production, VITE_API_URL is required.
// In local development, fallback to localhost.
const baseURL = (
  envUrl || (import.meta.env.DEV ? "http://localhost:5000" : "")
).replace(/\/+$/, "");

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

export { baseURL };
export default api;