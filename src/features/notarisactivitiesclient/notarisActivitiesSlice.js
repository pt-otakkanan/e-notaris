import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Dummy generator lengkap
const generateDummyActivities = (count = 10) => {
  const jenisAktaList = [
    "Akta Jual Beli",
    "Akta Hibah",
    "Akta Pernikahan",
    "Akta Perjanjian",
  ];
  const statusList = ["Draft", "Menunggu", "Selesai"];

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const first = [
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
  const last = [
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
  const phone = () =>
    `08${rand(11, 99)}-${rand(1000, 9999)}-${rand(1000, 9999)}`;
  const nik16 = () => String(1000000000000000 + rand(0, 899999999999999));

  const addr = () => {
    const streets = [
      "Jl. Merdeka",
      "Jl. Sudirman",
      "Jl. Ahmad Yani",
      "Jl. Diponegoro",
      "Jl. Imam Bonjol",
      "Jl. Pahlawan",
    ];
    const cities = [
      "Surabaya",
      "Sidoarjo",
      "Gresik",
      "Malang",
      "Jakarta",
      "Bandung",
      "Semarang",
    ];
    const no = rand(1, 200);
    const rt = String(rand(1, 10)).padStart(2, "0");
    const rw = String(rand(1, 10)).padStart(2, "0");
    const kodePos = String(10000 + rand(0, 89999));
    return `${pick(streets)} No. ${no}, RT ${rt}/RW ${rw}, ${pick(
      cities
    )} ${kodePos}`;
  };

  return Array.from({ length: count }, (_, i) => {
    const p1_first = pick(first),
      p1_last = pick(last);
    const p2_first = pick(first),
      p2_last = pick(last);

    return {
      id: i + 1,
      kode: `AKT-${String(1000 + i)}`,
      jenis_akta: pick(jenisAktaList),
      penghadap1: `${p1_first} ${p1_last}`,
      penghadap2: `${p2_first} ${p2_last}`,
      deskripsi:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      status: pick(statusList),
      draft_akta:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      waktu: new Date(Date.now() - rand(0, 60) * 86400000).toISOString(),

      // DETAIL TAMBAHAN
      penghadap1_email: `${p1_first.toLowerCase()}.${p1_last.toLowerCase()}@example.com`,
      penghadap2_email: `${p2_first.toLowerCase()}.${p2_last.toLowerCase()}@example.com`,
      penghadap1_nik: nik16(),
      penghadap2_nik: nik16(),
      penghadap1_ktp: `https://picsum.photos/seed/ktp-${i + 1}-a/800/500`,
      penghadap2_ktp: `https://picsum.photos/seed/ktp-${i + 1}-b/800/500`,
      penghadap1_phone: phone(),
      penghadap2_phone: phone(),
      penghadap1_address: addr(),
      penghadap2_address: addr(),
    };
  });
};

export const getNotarisActivitiesContent = createAsyncThunk(
  "/notarisActivities/content",
  async () => {
    try {
      const res = await axios.get("/api/notaris-activities");
      return res.data;
    } catch (e) {
      console.warn("API gagal, pakai dummy:", e?.message);
      return { data: generateDummyActivities(10) };
    }
  }
);

const slice = createSlice({
  name: "notarisActivities",
  initialState: { isLoading: false, items: [] },
  reducers: {
    deleteNotarisActivity: (state, action) => {
      const { index } = action.payload;
      state.items.splice(index, 1);
    },
  },
  extraReducers: {
    [getNotarisActivitiesContent.pending]: (state) => {
      state.isLoading = true;
    },
    [getNotarisActivitiesContent.fulfilled]: (state, action) => {
      state.items = action.payload.data;
      state.isLoading = false;
    },
    [getNotarisActivitiesContent.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { deleteNotarisActivity } = slice.actions;
export default slice.reducer;
