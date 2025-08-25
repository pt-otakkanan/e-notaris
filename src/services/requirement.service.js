// src/services/requirement.service.js
import api from "../lib/api";

const BASE = "/admin/requirement"; // ganti ke "/requirement" jika tanpa prefix admin

const RequirementService = {
  async remove(id) {
    const { data } = await api.delete(`/admin/requirement/${id}`);
    return data;
  },
  async list({ deed_id, page = 1, per_page = 10, search = "" } = {}) {
    const params = { page, per_page, search };
    if (deed_id) params.deed_id = deed_id;
    const { data } = await api.get(`${BASE}/`, { params });
    return data; // {success, data:[...], meta:{...}}
  },

  async detail(id) {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
  },

  async create({ deed_id, name, is_file }) {
    const { data } = await api.post(`${BASE}/`, {
      deed_id,
      name,
      is_file: !!is_file,
    });
    return data;
  },

  async update(id, payload) {
    const { data } = await api.post(`${BASE}/update/${id}`, payload);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`${BASE}/${id}`);
    return data;
  },
};

export default RequirementService;
