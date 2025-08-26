// src/features/identity-verification/identityVerificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import VerificationService from "../../services/verification.service";

const initialState = {
  isLoading: false,
  items: [],
  meta: null,
  error: null,
  // query terakhir (biar pagination/search/tab konsisten)
  lastQuery: { status: "pending", page: 1, per_page: 10, search: "" },
};

export const fetchIdentityList = createAsyncThunk(
  "idv/list",
  async (query = {}, { rejectWithValue }) => {
    try {
      const data = await VerificationService.list(query);
      return { data, query };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal mengambil data" }
      );
    }
  }
);

export const verifyIdentity = createAsyncThunk(
  "idv/verify",
  async ({ id, status, notes }, { getState, dispatch, rejectWithValue }) => {
    try {
      const res = await VerificationService.verify({ id, status, notes });
      // refetch pakai lastQuery biar tabel terbarui & pagination konsisten
      const { identityVerification } = getState();
      await dispatch(fetchIdentityList(identityVerification.lastQuery));
      return res;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: "Gagal memverifikasi" }
      );
    }
  }
);

const identityVerificationSlice = createSlice({
  name: "identityVerification",
  initialState,
  reducers: {
    setLastQuery: (state, action) => {
      state.lastQuery = { ...state.lastQuery, ...(action.payload || {}) };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIdentityList.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
      if (action.meta?.arg)
        state.lastQuery = { ...state.lastQuery, ...action.meta.arg };
    });

    builder.addCase(fetchIdentityList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      const payload = action.payload?.data || {};
      const arr = Array.isArray(payload.data) ? payload.data : [];
      state.meta = payload.meta || null;

      // map kolom sesuai response BE
      state.items = arr.map((it) => ({
        user_id: it.user_id,
        user_name: it.user_name,
        user_email: it.user_email,
        ktp: it.ktp, // NIK
        npwp: it.npwp,
        ktp_notaris: it.ktp_notaris,
        file_ktp: it.file_ktp,
        file_kk: it.file_kk,
        file_npwp: it.file_npwp,
        file_ktp_notaris: it.file_ktp_notaris,
        file_sign: it.file_sign,
        file_photo: it.file_photo,
        verification_status: it.verification_status,
        verification_notes: it.verification_notes,
        updated_at: it.updated_at,
      }));
    });

    builder.addCase(fetchIdentityList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Gagal memuat data";
    });
  },
});

export const { setLastQuery } = identityVerificationSlice.actions;
export default identityVerificationSlice.reducer;
