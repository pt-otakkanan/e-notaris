import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// util random
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// generator alamat dummy
const generateAddress = () => {
  const streets = [
    "Jl. Merdeka",
    "Jl. Sudirman",
    "Jl. Ahmad Yani",
    "Jl. Diponegoro",
    "Jl. Imam Bonjol",
    "Jl. Pahlawan",
    "Jl. Gatot Subroto",
    "Jl. S. Parman",
    "Jl. RA Kartini",
    "Jl. Gajah Mada",
  ];
  const cities = [
    "Surabaya",
    "Sidoarjo",
    "Gresik",
    "Malang",
    "Jakarta",
    "Bandung",
    "Semarang",
    "Yogyakarta",
    "Denpasar",
    "Makassar",
  ];
  const no = Math.floor(Math.random() * 200) + 1;
  const rt = String(Math.floor(Math.random() * 10) + 1).padStart(2, "0");
  const rw = String(Math.floor(Math.random() * 10) + 1).padStart(2, "0");
  const kodePos = String(10000 + Math.floor(Math.random() * 90000));
  return `${pick(streets)} No. ${no}, RT ${rt}/RW ${rw}, ${pick(
    cities
  )} ${kodePos}`;
};

// dummy users
const generateDummyUsers = (count = 20) => {
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
  const genders = ["Laki-laki", "Perempuan"];
  const roles = ["Notaris", "Penghadap"];
  const verifs = ["Ditolak", "Disetujui", "Menunggu"];

  return Array.from({ length: count }, (_, i) => {
    const first_name = pick(firstNames);
    const last_name = pick(lastNames);
    const joined = new Date();
    joined.setDate(joined.getDate() - Math.floor(Math.random() * 365));
    return {
      id: i + 1,
      first_name,
      last_name,
      email: `${first_name.toLowerCase()}.${last_name.toLowerCase()}@example.com`,
      avatar: `https://i.pravatar.cc/150?img=${
        Math.floor(Math.random() * 70) + 1
      }`,
      gender: pick(genders),
      role: pick(roles),
      verification_status: pick(verifs),
      address: generateAddress(),
      joined_at: joined.toISOString().split("T")[0],
    };
  });
};

// thunk API (tetap ada); fallback ke dummy jika error
export const getUsersContent = createAsyncThunk("/users/content", async () => {
  try {
    const res = await axios.get("/api/users?page=2", {});
    return res.data;
  } catch (e) {
    console.warn("API users gagal, pakai dummy:", e?.message);
    return { data: generateDummyUsers(20) };
  }
});

const usersSlice = createSlice({
  name: "user",
  initialState: { isLoading: false, users: [] },
  reducers: {
    addNewUser: (state, action) => {
      const { newUserObj } = action.payload;
      state.users = [...state.users, newUserObj];
    },
    deleteUser: (state, action) => {
      const { index } = action.payload;
      state.users.splice(index, 1);
    },
  },
  extraReducers: {
    [getUsersContent.pending]: (state) => {
      state.isLoading = true;
    },
    [getUsersContent.fulfilled]: (state, action) => {
      state.users = action.payload.data;
      state.isLoading = false;
    },
    [getUsersContent.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { addNewUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
