import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { deleteUser, getUsersContent } from "./userSlice";
import { setPageTitle } from "../common/headerSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

function Users() {
  const { users = [], isLoading = false } = useSelector(
    (state) => state.user || {}
  );
  const dispatch = useDispatch();

  // --- STATE: search query
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(setPageTitle("Pengguna"));
    dispatch(getUsersContent());
  }, [dispatch]);

  const openDetailUser = (user) => {
    dispatch(
      openModal({
        title: "Detail Pengguna",
        bodyType: MODAL_BODY_TYPES.USER_DETAIL,
        extraObject: user,
        size: "lg",
      })
    );
  };

  const deleteCurrentUser = (index) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Yakin ingin menghapus pengguna ini?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE,
          index,
        },
      })
    );
  };

  const renderStatusBadge = (status) => {
    const cls =
      {
        Disetujui:
          "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
        Menunggu:
          "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
        Ditolak:
          "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
      }[status] || "badge-ghost";
    return <div className={`badge ${cls}`}>{status || "Tidak diketahui"}</div>;
  };

  // --- MEMO: filter users by query
  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const fields = [
        u.first_name,
        u.last_name,
        u.email,
        u.role,
        u.verification_status,
        u.gender,
        u.address,
      ];
      return fields.some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [users, query]);

  // --- Top right content (search bar)
  const TopSideButtons = (
    <div className="flex items-center gap-2">
      <div className="join">
        <input
          type="text"
          className="input input-sm input-bordered join-item w-[250px]"
          placeholder="Cari nama, email, role, status..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-sm join-item"
          onClick={() => setQuery(query)} // noop utk submit enter
          type="button"
          aria-label="Search"
          title="Search"
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
        </button>
      </div>
      {query ? (
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setQuery("")}
          type="button"
        >
          Reset
        </button>
      ) : null}
    </div>
  );

  if (isLoading)
    return (
      <TitleCard
        title="Daftar Pengguna"
        topMargin="mt-2"
        TopSideButtons={TopSideButtons}
      >
        <div className="p-6 text-center">Memuat data…</div>
      </TitleCard>
    );

  return (
    <TitleCard
      title="Daftar Pengguna"
      topMargin="mt-2"
      TopSideButtons={TopSideButtons}
    >
      {filteredUsers.length === 0 ? (
        <div className="p-6 text-center opacity-70">
          {query ? (
            <>
              Tidak ada hasil untuk "
              <span className="font-semibold">{query}</span>"
            </>
          ) : (
            "Belum ada pengguna."
          )}
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="table w-full [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Jenis Kelamin</th>
                <th>Role</th>
                <th>Status</th>
                <th>Bergabung Sejak</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, k) => {
                const avatarSrc =
                  u.avatar || `https://i.pravatar.cc/150?img=${(k % 70) + 1}`;
                return (
                  <tr key={u.id ?? k}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={avatarSrc} alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{u.first_name}</div>
                          <div className="text-sm opacity-50">
                            {u.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.gender || "Laki-laki"}</td>
                    <td>{u.role || "User"}</td>
                    <td>{renderStatusBadge(u.verification_status)}</td>
                    <td>
                      {moment(u.joined_at || new Date()).format("DD MMM YYYY")}
                    </td>
                    <td className="flex">
                      <button
                        className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                        onClick={() => openDetailUser(u)}
                      >
                        Detail
                      </button>
                      <button
                        className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-800"
                        onClick={() => deleteCurrentUser(k)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </TitleCard>
  );
}

export default Users;
