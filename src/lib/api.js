import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export function formatError(err) {
  const d = err?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (d && typeof d === "object" && d.message) return d.message;
  if (Array.isArray(d)) return d.map(e => e?.msg || JSON.stringify(e)).join(" ");
  return err?.message || "Erro inesperado";
}
