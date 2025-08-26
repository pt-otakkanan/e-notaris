// src/features/notaris-activities/notarisActivitiesSlice.js
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
      // refetch pakai lastQuery biar tabel & paging konsisten
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

        // map kolom BE -> FE
        state.items = arr.map((it) => {
          const deed = pickRel(it, "deed");
          const first = pickRel(it, "first_client");
          const second = pickRel(it, "second_client");
          const schedules = it.schedules || [];

          // ambil jadwal pertama jika ada (sesuaikan field mu, mis. scheduled_at / start_time)
          const firstSchedule = schedules[0] || null;
          const scheduled_at =
            firstSchedule?.scheduled_at ||
            firstSchedule?.start_time ||
            firstSchedule?.date_time ||
            null;

          return {
            id: it.id,
            kode: it.tracking_code,
            jenis_akta: deed?.name || "-",
            penghadap1: first?.name || "-",
            penghadap2: second?.name || (second === null ? "-" : ""), // "-" jika single client
            status_raw: it.status_approval, // pending|approved|rejected
            status: mapStatus(it.status_approval),
            draft_akta: it.draft_file || null, // kalau BE punya field ini
            scheduled_date: scheduled_at, // untuk tombol jadwal
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
