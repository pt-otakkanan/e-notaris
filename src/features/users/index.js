// src/pages/App/Users.jsx
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import {
  deleteUserById,
  getUsersContent,
  setLastQuery,
} from "../users/userSlice";
import { setPageTitle } from "../common/headerSlice";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

const renderStatusBadge = (label) => {
  const cls =
    {
      Disetujui:
        "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
      Menunggu:
        "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
      Ditolak:
        "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
    }[label] || "badge-ghost";
  return <div className={`badge ${cls}`}>{label || "Tidak diketahui"}</div>;
};

function Users() {
  const dispatch = useDispatch();
  const {
    users = [],
    isLoading = false,
    meta,
    lastQuery,
  } = useSelector((s) => s.user || {});
  const [q, setQ] = useState(lastQuery?.q || "");

  useEffect(() => {
    dispatch(setPageTitle("Pengguna"));
    dispatch(getUsersContent(lastQuery));
  }, [dispatch]); // load pertama

  const filteredUsers = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => {
      const fields = [
        u.name,
        u.email,
        u.role,
        u.gender,
        u.address,
        u.status_verification,
      ];
      return fields.some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [users, q]);

  const submitSearch = () => {
    const payload = { page: 1, per_page: lastQuery?.per_page || 10, q };
    dispatch(setLastQuery(payload));
    dispatch(getUsersContent(payload));
  };

  const changePage = (page) => {
    if (!meta) return;
    const p = Math.max(1, Math.min(page, meta.last_page || 1));
    const payload = {
      page: p,
      per_page: lastQuery?.per_page || 10,
      q: lastQuery?.q || "",
    };
    dispatch(setLastQuery(payload));
    dispatch(getUsersContent(payload));
  };

  const openDetailUser = (idOrUser) => {
    // Lebih stabil kirim id, biar modal fetch fresh detail
    const id = typeof idOrUser === "number" ? idOrUser : idOrUser?.id;
    dispatch(
      openModal({
        title: "Detail Pengguna",
        bodyType: MODAL_BODY_TYPES.USER_DETAIL,
        extraObject: id,
        size: "lg",
      })
    );
  };

  const askDelete = (user) => {
    if (!user?.id) return;
    dispatch(
      openModal({
        title: "Hapus Pengguna",
        bodyType: MODAL_BODY_TYPES.USER_DELETE,
        extraObject: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    );
  };

  const TopSideButtons = (
    <div className="flex items-center gap-2">
      <div className="join">
        <input
          type="text"
          className="input input-sm input-bordered join-item w-[260px]"
          placeholder="Cari nama, email, role, status..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
        />
        <button
          className="btn btn-sm join-item"
          onClick={submitSearch}
          type="button"
          title="Cari"
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
        </button>
      </div>
      {q ? (
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => {
            setQ("");
            const payload = {
              page: 1,
              per_page: lastQuery?.per_page || 10,
              q: "",
            };
            dispatch(setLastQuery(payload));
            dispatch(getUsersContent(payload));
          }}
          type="button"
        >
          Reset
        </button>
      ) : null}
    </div>
  );

  return (
    <TitleCard
      title="Daftar Pengguna"
      topMargin="mt-2"
      TopSideButtons={TopSideButtons}
    >
      {isLoading ? (
        <div className="p-6 text-center">Memuat data…</div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-6 text-center opacity-70">
          {q ? (
            <>
              Tidak ada hasil untuk "<span className="font-semibold">{q}</span>"
            </>
          ) : (
            "Belum ada pengguna."
          )}
        </div>
      ) : (
        <>
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
                    u.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      u.name || "U"
                    )}`;
                  return (
                    <tr key={u.id ?? k}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={avatarSrc} alt="Avatar" />
                            </div>
                          </div>
                          <div className="font-medium">{u.name}</div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.gender}</td>
                      <td>{u.role}</td>
                      <td>{renderStatusBadge(u.status_verification)}</td>
                      <td>
                        {moment(u.created_at || new Date()).format(
                          "DD MMM YYYY"
                        )}
                      </td>
                      <td className="flex">
                        <button
                          className="text-blue-7 rounded-lg text-sm px-3 py-1 me-2 bg-blue-800 text-white"
                          onClick={() => openDetailUser(u.id)}
                        >
                          Detail
                        </button>
                        <button
                          className="text-red-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-red-800 text-white"
                          onClick={() => askDelete(u)}
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

          {/* Pagination */}
          {meta ? (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm opacity-70">
                Menampilkan {meta.from}–{meta.to} dari {meta.total}
              </div>
              <div className="join">
                <button
                  className="btn btn-sm join-item"
                  onClick={() => changePage((meta.current_page || 1) - 1)}
                  disabled={meta.current_page <= 1}
                >
                  «
                </button>
                <button className="btn btn-sm join-item">
                  Hal {meta.current_page} / {meta.last_page}
                </button>
                <button
                  className="btn btn-sm join-item"
                  onClick={() => changePage((meta.current_page || 1) + 1)}
                  disabled={meta.current_page >= meta.last_page}
                >
                  »
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </TitleCard>
  );
}

export default Users;
