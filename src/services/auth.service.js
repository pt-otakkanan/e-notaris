// src/services/auth.service.js
import api, { setAuthToken } from "../lib/api";

const AuthService = {
  async register(payload) {
    // payload: {name, email, password, confirmPassword, role_id: 2 | 3}
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  async login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    // simpan token & set header
    setAuthToken(data?.data?.token);
    // simpan info lain (opsional)
    localStorage.setItem("user_name", data?.data?.name ?? "");
    localStorage.setItem("user_email", data?.data?.email ?? "");
    localStorage.setItem("role_id", String(data?.data?.role_id ?? ""));
    return data;
  },

  async checkUser() {
    const { data } = await api.get("/auth/check-user"); // butuh token
    return data;
  },

  async checkToken() {
    const { data } = await api.get("/auth/check-token"); // butuh token
    return data;
  },

  async verifyEmail({ email, kode }) {
    const { data } = await api.post("/auth/verify", { email, kode });
    return data;
  },

  async resendCode({ email }) {
    const { data } = await api.post("/auth/resend", { email });
    return data;
  },

  async logout() {
    try {
      await api.post("/auth/logout"); // ignore jika fail
    } catch {}
    setAuthToken(null);
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("role_id");
    localStorage.removeItem("pendingEmail");
  },
};

export default AuthService;
