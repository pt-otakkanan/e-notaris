// src/features/deed/deedSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DeedService from "../../services/deed.service";
import RequirementService from "../../services/requirement.service";

const initialState = {
  isLoading: false,
  items: [],
  meta: null,
  error: null,
  lastQuery: { page: 1, per_page: 10, search: "" },
};

// LIST
export const fetchDeeds = createAsyncThunk(
  "deed/list",
  async (query = {}, { rejectWithValue }) => {
    try {
      const data = await DeedService.list(query);
      return { data, query };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal mengambil data" }
      );
    }
  }
);

// CREATE
export const createDeed = createAsyncThunk(
  "deed/create",
  async (payload, { getState, dispatch, rejectWithValue }) => {
    try {
      const res = await DeedService.create(payload);
      const { deed } = getState();
      await dispatch(fetchDeeds(deed.lastQuery));
      return res;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal membuat akta" }
      );
    }
  }
);

// UPDATE
export const updateDeed = createAsyncThunk(
  "deed/update",
  async ({ id, ...payload }, { getState, dispatch, rejectWithValue }) => {
    try {
      const res = await DeedService.update(id, payload);
      const { deed } = getState();
      await dispatch(fetchDeeds(deed.lastQuery));
      return res;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal memperbarui akta" }
      );
    }
  }
);

// DELETE
export const deleteDeedById = createAsyncThunk(
  "deed/delete",
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      const res = await DeedService.delete(id);
      const { deed } = getState();
      await dispatch(fetchDeeds(deed.lastQuery));
      return res;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal menghapus akta" }
      );
    }
  }
);

// ADD REQUIREMENT
export const addRequirementToDeed = createAsyncThunk(
  "deed/addRequirement",
  async (
    { deed_id, name, is_file },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const res = await RequirementService.create({ deed_id, name, is_file });
      const { deed } = getState();
      await dispatch(fetchDeeds(deed.lastQuery));
      return res;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal menambah dokumen" }
      );
    }
  }
);

const deedSlice = createSlice({
  name: "deed",
  initialState,
  reducers: {
    setLastQuery: (state, action) => {
      state.lastQuery = { ...state.lastQuery, ...(action.payload || {}) };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDeeds.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
      if (action.meta?.arg)
        state.lastQuery = { ...state.lastQuery, ...action.meta.arg };
    });

    builder.addCase(fetchDeeds.fulfilled, (state, action) => {
      state.isLoading = false;
      const payload = action.payload?.data || {};
      const arr = Array.isArray(payload.data) ? payload.data : payload;
      const list = Array.isArray(arr) ? arr : [];

      state.items = list.map((d) => ({
        id: d.id,
        nama: d.name,
        deskripsi: d.description,
        jumlah_penghadap: d.is_double_client ? 2 : 1,
        dokumen_tambahan: (d.requirements || []).map((r) => ({
          id: r.id,
          name: r.name,
          is_file: !!r.is_file,
        })),
        created_at: d.created_at,
      }));
      state.meta = payload.meta || null;
    });

    builder.addCase(fetchDeeds.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Gagal memuat data";
    });
  },
});

export const { setLastQuery } = deedSlice.actions;
export default deedSlice.reducer;
