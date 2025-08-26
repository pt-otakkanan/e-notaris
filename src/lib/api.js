// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: false,
  headers: { Accept: "application/json" },
});

// ===== Helpers untuk token =====
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

// Init dari localStorage saat app start
const bootToken = localStorage.getItem("token");
if (bootToken) setAuthToken(bootToken);

// ===== Interceptors =====
api.interceptors.request.use(
  (config) => {
    document.body.classList.add("loading-indicator");
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => {
    document.body.classList.remove("loading-indicator");
    return res;
  },
  (error) => {
    document.body.classList.remove("loading-indicator");

    const status = error?.response?.status;

    // 401/403 -> token invalid/expired / unverified / forbidden
    if (status === 401) {
      // Paksa logout bersih
      setAuthToken(null);
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
