import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// utils
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// dummy generator
const generateDummyIdentityVerifications = (count = 20) => {
  const firstNames = [
    "Budi",
    "Siti",
    "Andi",
    "Dewi",
    "Agus",
    "Rina",
    "Joko",
    "Lina",
    "Tono",
    "Fitri",
  ];
  const lastNames = [
    "Santoso",
    "Aisyah",
    "Wijaya",
    "Putri",
    "Haryanto",
    "Kusuma",
    "Pratama",
    "Utami",
    "Saputra",
    "Wulandari",
  ];

  return Array.from({ length: count }, (_, i) => {
    const first_name = pick(firstNames);
    const last_name = pick(lastNames);

    // waktu upload acak 0–60 hari lalu
    const uploaded = new Date();
    uploaded.setDate(uploaded.getDate() - rand(0, 60));
    uploaded.setHours(rand(0, 23), rand(0, 59), rand(0, 59), 0);

    // file dummy (pakai picsum sebagai placeholder)
    const ktpUrl = `https://picsum.photos/seed/ktp-${i + 1}/800/500`;
    const kkUrl = `https://picsum.photos/seed/kk-${i + 1}/800/500`;
    const ttdUrl = `https://picsum.photos/seed/ttd-${i + 1}/600/220`;

    // nik & npwp dummy
    const nik = String(1000000000000000 + rand(0, 899999999999999)); // 16 digit
    const npwp = `${rand(10, 99)}.${rand(100, 999)}.${rand(100, 999)}.${rand(
      1,
      9
    )}-${rand(100, 999)}.${rand(100, 999)}`;

    return {
      id: i + 1,
      first_name,
      last_name,
      // field sesuai permintaan:
      nik,
      ktp: ktpUrl,
      kk: kkUrl,
      npwp,
      tanda_tangan: ttdUrl,
      uploaded_at: uploaded.toISOString(),

      // tambahan ringan supaya modal/detail masih bisa dipakai bila perlu
      email: `${first_name.toLowerCase()}.${last_name.toLowerCase()}@example.com`,
      avatar: `https://i.pravatar.cc/150?img=${rand(1, 70)}`,
    };
  });
};

// thunk API (tetap ada); fallback ke dummy jika gagal
export const getIdentityVerificationsContent = createAsyncThunk(
  "/identity-verifications/content",
  async () => {
    try {
      // ganti endpoint ini ke endpoint kamu saat sudah siap
      const res = await axios.get("/api/identity-verifications", {});
      return res.data;
    } catch (e) {
      console.warn(
        "API identity verifications gagal, pakai dummy:",
        e?.message
      );
      return { data: generateDummyIdentityVerifications(20) };
    }
  }
);

const identityVerificationSlice = createSlice({
  name: "identityVerification",
  initialState: {
    isLoading: false,
    items: [], // list verifikasi identitas
  },
  reducers: {
    addNewIdentityVerification: (state, action) => {
      const { newItem } = action.payload;
      state.items = [...state.items, newItem];
    },
    deleteIdentityVerification: (state, action) => {
      const { index } = action.payload;
      state.items.splice(index, 1);
    },
  },
  extraReducers: {
    [getIdentityVerificationsContent.pending]: (state) => {
      state.isLoading = true;
    },
    [getIdentityVerificationsContent.fulfilled]: (state, action) => {
      state.items = action.payload.data;
      state.isLoading = false;
    },
    [getIdentityVerificationsContent.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { addNewIdentityVerification, deleteIdentityVerification } =
  identityVerificationSlice.actions;

export default identityVerificationSlice.reducer;
