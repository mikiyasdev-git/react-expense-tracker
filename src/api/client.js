import axios from "axios";

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY = "auth_token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // fail after 15 seconds instead of waiting forever
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ---------- Request: attach token ----------
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------- Response: unwrap data, normalize errors ----------
apiClient.interceptors.response.use(
  (response) => response.data,

  (error) => {
    const status = error.response?.status ?? null;
    const data = error.response?.data;

    // Pick the best message available
    let message = data?.message || data?.error;

    if (!error.response) {
      // No response at all: server down, no internet, or timeout
      message =
        error.code === "ECONNABORTED"
          ? "The request timed out. Please try again."
          : "Cannot reach the server. Check your connection.";
    }

    if (!message) {
      message = "Something went wrong.";
    }

    // 401 = token missing, invalid, or expired
    const isLoginRequest = error.config?.url?.includes("/login");
    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }

    // Build a clean error that keeps the useful details
    const apiError = new Error(message);
    apiError.status = status;
    apiError.errors = data?.errors ?? {}; // Laravel field errors

    return Promise.reject(apiError);
  }
);

export default apiClient;