// src/features/notarisactivitiesclient/notarisActivitiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NotarisActivityClientService from "../../services/notarisActivityClient.service";

// ===== helpers =====
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

// ===== state =====
const initialState = {
  isLoading: false,
  items: [],
  meta: null,
  error: null,
  lastQuery: { search: "", status: "", page: 1, per_page: 10 },
  // detail cache opsional
  detail: null,
  isLoadingDetail: false,
};

// ===== thunks =====
export const getNotarisActivitiesContent = createAsyncThunk(
  "notarisActivitiesClient/list",
  async (query = {}, { getState, rejectWithValue }) => {
    try {
      const { notarisActivities = {} } = getState();
      // jika tidak ada query masuk, gunakan lastQuery dari slice client sendiri
      const q = { ...initialState.lastQuery, ...(query || {}) };
      const data = await NotarisActivityClientService.list(q);
      return { data, query: q };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal memuat aktivitas" }
      );
    }
  }
);

export const getNotarisActivityDetail = createAsyncThunk(
  "notarisActivitiesClient/detail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await NotarisActivityClientService.detail(id);
      return data;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal memuat detail aktivitas" }
      );
    }
  }
);

export const approveClientActivity = createAsyncThunk(
  "notarisActivitiesClient/approve",
  async ({ id, notes = "" }, { dispatch, rejectWithValue, getState }) => {
    try {
      await NotarisActivityClientService.clientApproval(id, {
        approval_status: "approved",
        ...(notes ? { notes } : {}),
      });
      const { notarisActivitiesClient } = getState();
      await dispatch(
        getNotarisActivitiesContent(notarisActivitiesClient?.lastQuery)
      );
      return true;
    } catch (e) {
      console.log(e);
      return rejectWithValue(
        e?.response?.data || { message: "Gagal menyetujui aktivitas" }
      );
    }
  }
);

export const rejectClientActivity = createAsyncThunk(
  "notarisActivitiesClient/reject",
  async ({ id, notes = "" }, { dispatch, rejectWithValue, getState }) => {
    try {
      await NotarisActivityClientService.clientApproval(id, {
        approval_status: "rejected",
        ...(notes ? { notes } : {}),
      });
      const { notarisActivitiesClient } = getState();
      await dispatch(
        getNotarisActivitiesContent(notarisActivitiesClient?.lastQuery)
      );
      return true;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal menolak aktivitas" }
      );
    }
  }
);

// (opsional) agar import lama tidak error jika masih ada:
// tidak dipakai oleh client/penghadap, tapi biar aman kalau ter-import.
export const deleteNotarisActivity = createAsyncThunk(
  "notarisActivitiesClient/delete",
  async () => {
    throw new Error(
      "Penghadap tidak memiliki akses untuk menghapus aktivitas."
    );
  }
);

// ===== slice =====
const slice = createSlice({
  name: "notarisActivitiesClient",
  initialState,
  reducers: {
    setClientLastQuery: (state, action) => {
      state.lastQuery = { ...state.lastQuery, ...(action.payload || {}) };
    },
    clearClientDetail: (state) => {
      state.detail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(getNotarisActivitiesContent.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        if (action.meta?.arg)
          state.lastQuery = { ...state.lastQuery, ...action.meta.arg };
      })
      .addCase(getNotarisActivitiesContent.fulfilled, (state, action) => {
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

          // gabung tanggal + jam jadi "YYYY-MM-DD HH:mm"
          let schedule_id = null;
          let scheduled_date = null;
          let schedule_location = null;
          let schedule_notes = null;
          let schedule_status = null;

          if (firstSchedule) {
            const ymd = (firstSchedule.date || "").slice(0, 10);
            const t = firstSchedule.time || "00:00";
            scheduled_date = ymd ? `${ymd} ${t}` : null;
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
            penghadap1_email: first?.email || "-",
            penghadap2_email: second?.email || "-",
            status_raw: it.status_approval,
            status: mapStatus(it.status_approval),

            // approval penghadap
            status_penghadap1_raw: it.first_client_approval,
            status_penghadap1: mapApprovalStatus(it.first_client_approval),
            status_penghadap2_raw: it.second_client_approval,
            status_penghadap2: mapApprovalStatus(it.second_client_approval),

            draft_akta: it.draft_file || null,

            // schedule
            scheduled_date,
            schedule_location,
            schedule_notes,
            schedule_status,
            schedule_id,
          };
        });
      })
      .addCase(getNotarisActivitiesContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Gagal memuat aktivitas";
      })

      // detail
      .addCase(getNotarisActivityDetail.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(getNotarisActivityDetail.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        const d = action.payload?.data || null;
        state.detail = d;
      })
      .addCase(getNotarisActivityDetail.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error =
          action.payload?.message || "Gagal memuat detail aktivitas";
      })

      // approve/reject error handling
      .addCase(approveClientActivity.rejected, (state, action) => {
        state.error = action.payload?.message || "Gagal menyetujui aktivitas";
      })
      .addCase(rejectClientActivity.rejected, (state, action) => {
        state.error = action.payload?.message || "Gagal menolak aktivitas";
      });
  },
});

export const { setClientLastQuery, clearClientDetail } = slice.actions;
export default slice.reducer;
