// axios instance mu
import api from "../lib/api";

const NotarisActivityClientService = {
  // profile buat tau user.id
  async profile() {
    const { data } = await api.get("/user/profile");
    return data; // { success, data: { id, name, ... } }
  },

  // list aktivitas versi penghadap: GET /user/activity
  async list(params = {}) {
    const { data } = await api.get("/user/activity", { params });
    return data; // { success, data:[...], meta?:{...} }
  },

  // detail aktivitas versi penghadap: GET /user/activity/{id}
  async detail(id) {
    const { data } = await api.get(`/user/activity/${id}`);
    return data; // { success, data:{...} }
  },

  // approve/reject penghadap: POST /user/activity/approval/{id}
  async clientApproval(id, { approval_status }) {
    const { data } = await api.post(`/user/activity/approval/${id}`, {
      approval_status,
    });
    return data; // { success, data:{...} }
  },
};

export default NotarisActivityClientService;
