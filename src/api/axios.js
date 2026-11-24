import axios from "axios";

// Use the Express API directly by default. Set VITE_API_URL only when deploying elsewhere.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://emp-system-backend-ndxg.onrender.com",
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ems_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthCall = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");
    if (error.response?.status === 401 && !isAuthCall && localStorage.getItem("ems_token")) {
      localStorage.removeItem("ems_token");
      localStorage.removeItem("ems_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const errorMessage = (err, fallback = "Something went wrong. Try again.") => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ERR_NETWORK") return "Cannot reach the backend API at https://emp-system-backend-ndxg.onrender.com. Start the backend and check its port.";
  return fallback;
};
export default api;
