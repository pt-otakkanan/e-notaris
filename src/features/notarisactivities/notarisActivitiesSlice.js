import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NotarisActivityService from "../../services/notarisActivity.service";

const initialState = {
  isLoading: false,
  items: [],
  meta: null,
  error: null,
  lastQuery: { search: "", status: "", page: 1, per_page: 10 },
};

// LIST
export const fetchNotarisActivities = createAsyncThunk(
  "notarisActivities/list",
  async (query = {}, { rejectWithValue }) => {
    try {
      const data = await NotarisActivityService.list(query);
      return { data, query };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal memuat aktivitas" }
      );
    }
  }
);

// DELETE by id
export const deleteNotarisActivityById = createAsyncThunk(
  "notarisActivities/deleteById",
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      await NotarisActivityService.remove(id);
      const { notarisActivities } = getState();
      await dispatch(fetchNotarisActivities(notarisActivities.lastQuery));
      return true;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal menghapus aktivitas" }
      );
    }
  }
);

const mapStatus = (s) => {
  const k = String(s || "").toLowerCase();
  if (k === "approved") return "Selesai";
  if (k === "pending") return "Menunggu";
  if (k === "rejected") return "Ditolak";
  return "Tidak diketahui";
};

const mapApprovalStatus = (s) => {
  const k = String(s || "").toLowerCase();
  if (k === "approved") return "Disetujui";
  if (k === "pending") return "Menunggu";
  if (k === "rejected") return "Ditolak";
  return "Tidak diketahui";
};

const pickRel = (row, key) =>
  row?.[key] || row?.[key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())];

const slice = createSlice({
  name: "notarisActivities",
  initialState,
  reducers: {
    setLastQuery: (state, action) => {
      state.lastQuery = { ...state.lastQuery, ...(action.payload || {}) };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotarisActivities.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        if (action.meta?.arg)
          state.lastQuery = { ...state.lastQuery, ...action.meta.arg };
      })
      .addCase(fetchNotarisActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const payload = action.payload?.data || {};
        const arr = Array.isArray(payload.data) ? payload.data : [];
        state.meta = payload.meta || null;

        state.items = arr.map((it) => {
          const deed = pickRel(it, "deed");
          const first = pickRel(it, "first_client");
          const second = pickRel(it, "second_client");
          const schedules = it.schedules || [];
          const firstSchedule = schedules[0] || null;

          // Gabungkan tanggal + jam,
          // BE kirim date: "2025-08-28T00:00:00.000000Z", time: "HH:mm"
          let schedule_id = null;
          let scheduled_date = null;
          let schedule_location = null;
          let schedule_notes = null;
          let schedule_status = null;

          if (firstSchedule) {
            const ymd = (firstSchedule.date || "").slice(0, 10); // "YYYY-MM-DD"
            const t = firstSchedule.time || "00:00"; // "HH:mm"
            scheduled_date = ymd ? `${ymd} ${t}` : null; // "YYYY-MM-DD HH:mm"
            schedule_location = firstSchedule.location || null;
            schedule_notes = firstSchedule.notes || null;
            schedule_status = firstSchedule.status || null;
            schedule_id = firstSchedule.id || null;
          }

          return {
            id: it.id,
            kode: it.tracking_code,
            nama: it.name,
            jenis_akta: deed?.name || "-",
            penghadap1: first?.name || "-",
            penghadap2: second?.name || (second === null ? "-" : ""),
            status_raw: it.status_approval,
            status: mapStatus(it.status_approval),

            // status approval penghadap
            status_penghadap1_raw: it.first_client_approval,
            status_penghadap1: mapApprovalStatus(it.first_client_approval),
            status_penghadap2_raw: it.second_client_approval,
            status_penghadap2: mapApprovalStatus(it.second_client_approval),

            draft_akta: it.draft_file || null,

            // penjadwalan
            scheduled_date,
            schedule_location,
            schedule_notes,
            schedule_status,
            schedule_id,
          };
        });
      })
      .addCase(fetchNotarisActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Gagal memuat aktivitas";
      })
      .addCase(deleteNotarisActivityById.rejected, (state, action) => {
        state.error = action.payload?.message || "Gagal menghapus aktivitas";
      });
  },
});

export const { setLastQuery } = slice.actions;
export default slice.reducer;
