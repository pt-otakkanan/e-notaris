import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// utils
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// dummy generator deeds
const generateDummyDeeds = (count = 16) => {
  const names = [
    "Pendirian PT",
    "Jual Beli",
    "Perjanjian Sewa",
    "Pendirian CV",
  ];
  const extrasPool = [
    "NPWP",
    "Anggaran Dasar",
    "NIB",
    "SIUP",
    "KTP Direksi",
    "TDP",
  ];

  return Array.from({ length: count }, (_, i) => {
    const nama = pick(names);
    const jumlah_penghadap = rand(1, 2);
    const nExtras = rand(0, 2);
    const dokumen_tambahan = Array.from({ length: nExtras }, (_, j) => {
      const label = pick(extrasPool);
      return {
        name: label,
        url: `https://files.example.com/deeds/${i + 1}/${label
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf`,
      };
    });
    return {
      id: i + 1,
      nama,
      deskripsi: `Dokumen ${nama} nomor ${1000 + i} dengan ketentuan singkat.`,
      jumlah_penghadap,
      dokumen_tambahan,
      created_at: new Date(Date.now() - rand(0, 60) * 86400000).toISOString(),
    };
  });
};

// thunk API (tetap ada); fallback ke dummy bila gagal
export const getDeedsContent = createAsyncThunk("/deeds/content", async () => {
  try {
    const res = await axios.get("/api/deeds", {});
    return res.data; // harapkan { data: [...] }
  } catch (e) {
    console.warn("API deeds gagal, pakai dummy:", e?.message);
    return { data: generateDummyDeeds(16) };
  }
});

const deedSlice = createSlice({
  name: "deed",
  initialState: { isLoading: false, items: [] },
  reducers: {
    addNewDeed: (state, action) => {
      const { newItem } = action.payload;
      state.items = [...state.items, newItem];
    },
    deleteDeed: (state, action) => {
      const { index } = action.payload;
      state.items.splice(index, 1);
    },
  },
  extraReducers: {
    [getDeedsContent.pending]: (state) => {
      state.isLoading = true;
    },
    [getDeedsContent.fulfilled]: (state, action) => {
      state.items = action.payload.data || [];
      state.isLoading = false;
    },
    [getDeedsContent.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { addNewDeed, deleteDeed } = deedSlice.actions;
export default deedSlice.reducer;
