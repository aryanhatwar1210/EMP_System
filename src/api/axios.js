
import axios from "axios";

// Backend API configuration
const api = axios.create({
  baseURL: "https://emp-system-backend-ndxg.onrender.com/api",
  timeout: 20000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ems_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (res) => res,

  (error) => {
    const isAuthCall =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      !isAuthCall &&
      localStorage.getItem("ems_token")
    ) {
      localStorage.removeItem("ems_token");
      localStorage.removeItem("ems_user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Error message handler
export const errorMessage = (
  err,
  fallback = "Something went wrong. Try again."
) => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  if (err?.code === "ERR_NETWORK") {
    return "Cannot reach the backend API. Please check your internet connection or backend server.";
  }

  return fallback;
};

export default api;
