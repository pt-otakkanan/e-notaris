// src/services/user.service.js
import api from "../lib/api";

const UserService = {
  // ===== PROFILE (user sendiri) =====
  async getProfile() {
    const { data } = await api.get("/user/profile");
    return data;
  },

  async updateProfile({ name, telepon, address, gender, file_avatar }) {
    const fd = new FormData();
    if (name) fd.append("name", name);
    if (telepon) fd.append("telepon", telepon);
    if (address) fd.append("address", address);
    if (gender) fd.append("gender", gender);
    if (file_avatar) fd.append("file_avatar", file_avatar);
    const { data } = await api.post("/user/update-profile", fd);
    return data;
  },

  async updateIdentityProfile(payload) {
    const fd = new FormData();
    if (payload.ktp) fd.append("ktp", payload.ktp);
    if (payload.npwp) fd.append("npwp", payload.npwp);
    if (payload.ktp_notaris) fd.append("ktp_notaris", payload.ktp_notaris);
    if (payload.file_ktp) fd.append("file_ktp", payload.file_ktp);
    if (payload.file_kk) fd.append("file_kk", payload.file_kk);
    if (payload.file_npwp) fd.append("file_npwp", payload.file_npwp);
    if (payload.file_photo) fd.append("file_photo", payload.file_photo);
    if (payload.file_ktp_notaris)
      fd.append("file_ktp_notaris", payload.file_ktp_notaris);
    if (payload.file_sign) fd.append("file_sign", payload.file_sign);
    const { data } = await api.post("/user/update-identity-profile", fd);
    return data;
  },

  // ===== ADMIN =====
  async listAdminUsers({ page = 1, per_page = 10, q = "" } = {}) {
    const { data } = await api.get("/admin/user", {
      params: { page, per_page, q },
    });
    return data; // { success, data:[{... incl roles, identity ...}], meta:{...} }
  },

  async getAdminUserDetail(id) {
    const { data } = await api.get(`/admin/user/${id}`);
    return data; // (disarankan BE juga return roles + identity di sini)
  },

  async deleteAdminUser(id) {
    const { data } = await api.delete(`/admin/user/${id}`);
    return data;
  },
};

export default UserService;
