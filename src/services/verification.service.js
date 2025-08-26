// src/services/admin/verification.service.js
import api from "../lib/api";

const VerificationService = {
  async list({ status = "all", page = 1, per_page = 10, search = "" } = {}) {
    const { data } = await api.get(
      (() => {
        switch ((status || "all").toLowerCase()) {
          case "pending":
            return "/admin/verification/users-pending";
          case "rejected":
            return "/admin/verification/users-rejected";
          case "approved":
            return "/admin/verification/users-approved";
          case "rejected-pending":
            return "/admin/verification/users-rejected-pending";
          default:
            return "/admin/verification/users";
        }
      })(),
      { params: { page, per_page, search } }
    );
    return data;
  },

  async detail(userId) {
    const { data } = await api.get(`/admin/verification/users/${userId}`);
    return data;
  },

  async verify({ id, status, notes }) {
    const payload = { id, status_verification: status };

    // tambah notes hanya jika REJECT & ada teks
    if (String(status).toLowerCase() === "rejected") {
      const n = typeof notes === "string" ? notes.trim() : "";
      if (n) payload.notes_verification = n; // JANGAN kirim null
    }

    const { data } = await api.post("/admin/verification/identity", payload);
    return data;
  },
};

export default VerificationService;
