// src/services/deed.service.js
import api from "../lib/api";

const BASE = "/admin/deed"; // ganti ke "/deed" jika tanpa prefix admin

const DeedService = {
  async list({ page = 1, per_page = 10, search = "" } = {}) {
    const { data } = await api.get(`${BASE}/`, {
      params: { page, per_page, search },
    });
    return data; // {success, data:[...], meta:{...}}
  },

  async detail(id) {
    const { data } = await api.get(`${BASE}/${id}`);
    return data; // {success, data:{...}}
  },

  async create({ name, description, is_double_client }) {
    const { data } = await api.post(`${BASE}/`, {
      name,
      description,
      is_double_client: !!is_double_client,
    });
    return data;
  },

  async update(id, payload) {
    // BE kamu pakai POST /update/{id}
    const { data } = await api.post(`${BASE}/update/${id}`, payload);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`${BASE}/${id}`);
    return data;
  },
};

export default DeedService;
