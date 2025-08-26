// src/services/notarisActivity.service.js
import api from "../lib/api"; // axios instance dgn baseURL /api dan auth

const NotarisActivityService = {
  async listClients({ page = 1, per_page = 10, search = "" } = {}) {
    const { data } = await api.get("/notaris/activity/user/client", {
      params: { page, per_page, search },
    });
    return data; // { success, data:[{value,label,...}], meta:{...} }
  },

  // GET /activity?search=&status=&page=&per_page=
  async list({ search = "", status = "", page = 1, per_page = 10 } = {}) {
    const { data } = await api.get("/notaris/activity", {
      params: { search, status, page, per_page },
    });
    return data; // {success, data:[...], meta:{...}}
  },

  // GET /activity/{id}
  async detail(id) {
    const { data } = await api.get(`/notaris/activity/${id}`);
    return data; // {success, data:{...}}
  },

  // POST /activity
  async create(payload) {
    const { data } = await api.post("/notaris/activity", payload);
    return data;
  },

  // POST /activity/update/{id}  (menyesuaikan route kamu)
  async update(id, payload) {
    const { data } = await api.post(`/notaris/activity/update/${id}`, payload);
    return data;
  },

  // DELETE /activity/{id}
  async remove(id) {
    const { data } = await api.delete(`/notaris/activity/${id}`);
    return data;
  },

  // (opsional) approve/reject
  async approve(id) {
    const { data } = await api.put(`/notaris/activity/${id}/approve`);
    return data;
  },
  async reject(id) {
    const { data } = await api.put(`/notaris/activity/${id}/reject`);
    return data;
  },
};

export default NotarisActivityService;
