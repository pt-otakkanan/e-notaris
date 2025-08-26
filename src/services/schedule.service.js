// src/services/schedule.service.js
import api from "../lib/api";

const ScheduleService = {
  // GET / - Mendapatkan semua schedule
  getAll: async () => {
    const { data } = await api.get("/notaris/schedule");
    return data;
  },

  // GET /{id} - Mendapatkan schedule berdasarkan ID
  getById: async (id) => {
    const { data } = await api.get(`/notaris/schedule/${id}`);
    return data;
  },

  // POST / - Membuat schedule baru
  create: async ({ activity_id, date, time, location, notes = "" }) => {
    const { data } = await api.post("/notaris/schedule", {
      activity_id,
      date,
      time,
      location,
      notes,
    });
    return data;
  },

  // POST /update/{id} - Update schedule berdasarkan ID
  update: async (id, { activity_id, date, time, location, notes }) => {
    const { data } = await api.post(`/notaris/schedule/update/${id}`, {
      activity_id,
      date,
      time,
      location,
      notes,
    });
    return data;
  },

  // DELETE /{id} - Hapus schedule berdasarkan ID
  delete: async (id) => {
    const { data } = await api.delete(`/notaris/schedule/${id}`);
    return data;
  },

  // DELETE by activity ID - jika ada endpoint khusus
  deleteByActivityId: async (activityId) => {
    const { data } = await api.delete(
      `/notaris/schedule/by-activity/${activityId}`
    );
    return data;
  },
};

export default ScheduleService;
