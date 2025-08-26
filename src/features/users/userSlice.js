// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "../../services/user.service";

const mapGender = (g) => {
  if (!g) return "-";
  const s = String(g).toLowerCase();
  if (s === "male") return "Laki-laki";
  if (s === "female") return "Perempuan";
  if (s === "lainnya") return "Lainnya";
  return "-";
};

const statusLabel = (s) => {
  const k = String(s || "").toLowerCase();
  if (k === "approved") return "Disetujui";
  if (k === "pending") return "Menunggu";
  if (k === "rejected") return "Ditolak";
  return "Tidak diketahui";
};

// LIST (paginated)
export const getUsersContent = createAsyncThunk(
  "user/list",
  async ({ page = 1, per_page = 10, q = "" } = {}, { rejectWithValue }) => {
    try {
      const res = await UserService.listAdminUsers({ page, per_page, q });
      return res; // { success, data, meta }
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal mengambil data" }
      );
    }
  }
);

// DETAIL
export const getUserDetail = createAsyncThunk(
  "user/detail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await UserService.getAdminUserDetail(id);
      return res; // { success, data:{... (harap sudah include roles+identity)} }
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal mengambil detail" }
      );
    }
  }
);

// DELETE
export const deleteUserById = createAsyncThunk(
  "user/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await UserService.deleteAdminUser(id);
      return { id, resp: res };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal menghapus" }
      );
    }
  }
);

const initialState = {
  isLoading: false,
  users: [],
  raw: [],
  meta: null,
  detail: null,
  error: null,
  lastQuery: { page: 1, per_page: 10, q: "" },
};

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearDetail: (state) => {
      state.detail = null;
    },
    setLastQuery: (state, action) => {
      state.lastQuery = { ...state.lastQuery, ...(action.payload || {}) };
    },
  },
  extraReducers: (builder) => {
    // LIST
    builder.addCase(getUsersContent.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUsersContent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      const payload = action.payload || {};
      const arr = Array.isArray(payload.data) ? payload.data : [];
      state.raw = arr;
      state.meta = payload.meta || null;

      state.users = arr.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        telepon: u.telepon || "-",
        gender: mapGender(u.gender),
        address: u.address || "-",
        // avatar prioritas: identity.file_photo -> user.file_avatar -> null
        avatar: u.identity?.file_photo || u.file_avatar || null,
        role: u.roles?.name ? u.roles.name : "-", // "penghadap"/"notaris"/"admin"
        status_verification: statusLabel(u.status_verification),
        status_raw: u.status_verification,
        notes_verification: u.notes_verification,
        created_at: u.created_at,
      }));
    });
    builder.addCase(getUsersContent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Gagal memuat data";
    });

    // DETAIL
    builder.addCase(getUserDetail.pending, (state) => {
      state.detail = null;
      state.error = null;
    });
    builder.addCase(getUserDetail.fulfilled, (state, action) => {
      const d = action.payload?.data || {};
      state.detail = {
        id: d.id,
        name: d.name,
        email: d.email,
        telepon: d.telepon || "-",
        gender: mapGender(d.gender),
        address: d.address || "-",
        avatar: d.identity?.file_photo || d.file_avatar || null,
        role: d.roles?.name || "-",
        status_verification: statusLabel(d.status_verification),
        status_raw: d.status_verification,
        notes_verification: d.notes_verification,
        created_at: d.created_at,
        // identity full (agar modal bisa pakai langsung)
        identity: d.identity || null,
      };
    });
    builder.addCase(getUserDetail.rejected, (state, action) => {
      state.detail = null;
      state.error = action.payload?.message || "Gagal memuat detail";
    });

    // DELETE
    builder.addCase(deleteUserById.fulfilled, (state, action) => {
      const id = action.payload?.id;
      if (id) {
        state.users = state.users.filter((u) => u.id !== id);
        state.raw = state.raw.filter((u) => u.id !== id);
      }
    });
  },
});

export const { clearDetail, setLastQuery } = usersSlice.actions;
export default usersSlice.reducer;
