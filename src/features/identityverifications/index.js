// src/features/identity-verification/index.jsx
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { setPageTitle, showNotification } from "../common/headerSlice";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import {
  fetchIdentityList,
  setLastQuery,
  verifyIdentity,
} from "./identityVerificationSlice";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

const fileLink = (url, label = "Klik di sini") =>
  url ? (
    <a
      className="link link-primary"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {label}
    </a>
  ) : (
    "-"
  );

const StatusBadge = ({ value }) => {
  const s = String(value || "").toLowerCase();
  const label =
    s === "approved"
      ? "Disetujui"
      : s === "rejected"
      ? "Ditolak"
      : s === "pending"
      ? "Menunggu"
      : "Tidak diketahui";
  const cls =
    {
      Disetujui:
        "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
      Menunggu:
        "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
      Ditolak:
        "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
    }[label] || "badge-ghost";
  return <span className={`badge ${cls}`}>{label}</span>;
};

function IdentityVerifications() {
  const dispatch = useDispatch();
  const {
    items = [],
    meta,
    isLoading,
    lastQuery,
  } = useSelector((s) => s.identityVerification || {});

  const [query, setQuery] = useState(lastQuery.search || "");
  const [statusTab, setStatusTab] = useState(lastQuery.status || "pending");

  useEffect(() => {
    dispatch(setPageTitle("Verifikasi Identitas"));
    dispatch(fetchIdentityList(lastQuery));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // --- actions
  const refetch = (q) => dispatch(fetchIdentityList(q));

  const onSearch = () => {
    const q = { ...lastQuery, search: query, page: 1, status: statusTab };
    dispatch(setLastQuery(q));
    refetch(q);
  };

  const changeTab = (s) => {
    setStatusTab(s);
    const q = { ...lastQuery, status: s, page: 1, search: query };
    dispatch(setLastQuery(q));
    refetch(q);
  };

  const changePage = (page) => {
    if (!meta) return;
    const p = Math.max(1, Math.min(page, meta.last_page || 1));
    const q = { ...lastQuery, page: p, status: statusTab, search: query };
    dispatch(setLastQuery(q));
    refetch(q);
  };

  const openDetailUser = (idOrUser) => {
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

  const askApprove = (row) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Yakin ingin menyetujui verifikasi atas nama ${row.user_name}?`,
          type: "IDV_APPROVE",
          onConfirm: async () => {
            await dispatch(
              verifyIdentity({ id: row.user_id, status: "approved" })
            );
            dispatch(
              showNotification({ message: "Berhasil disetujui", status: 1 })
            );
          },
        },
      })
    );
  };

  const askReject = (row) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Yakin ingin menolak verifikasi ini?`,
          type: "IDV_REJECT",
          onConfirm: async (reasonText) => {
            await dispatch(
              verifyIdentity({
                id: row.user_id,
                status: "rejected",
                notes: reasonText,
              })
            );
            dispatch(
              showNotification({ message: "Berhasil ditolak", status: 1 })
            );
          },
        },
      })
    );
  };

  // --- top-right controls
  const TopSideButtons = (
    <div className="flex items-center gap-2">
      {/* Tabs status */}
      <div className="join hidden md:inline-flex">
        {[
          { v: "pending", label: "Menunggu" },
          { v: "approved", label: "Disetujui" },
          { v: "rejected", label: "Ditolak" },
          // { v: "rejected-pending", label: "Rejected+Pending" },
          { v: "all", label: "Semua" },
        ].map((t) => (
          <button
            key={t.v}
            className={`btn btn-sm join-item hover:bg-[#0256c4] ${
              statusTab === t.v ? "bg-[#0256c4] text-white" : "btn-outline "
            }`}
            onClick={() => changeTab(t.v)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="join">
        <input
          type="text"
          className="input input-sm input-bordered join-item w-[280px]"
          placeholder="Cari nama atau email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <button
          className="btn btn-sm join-item"
          onClick={onSearch}
          type="button"
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <TitleCard
      title="Verifikasi Identitas"
      topMargin="mt-2"
      TopSideButtons={TopSideButtons}
    >
      {isLoading ? (
        <div className="p-6 text-center">Memuat data…</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-center opacity-70">Tidak ada data.</div>
      ) : (
        <>
          <div className="overflow-x-auto w-full">
            <table className="table w-full [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>NIK</th>
                  <th>NPWP</th>
                  <th>KTP</th>
                  <th>KK</th>
                  <th>TTD</th>
                  <th>Foto</th>
                  <th>Status</th>
                  <th>Diperbarui</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.user_id}>
                    <td className="max-w-[180px] truncate">{row.user_name}</td>
                    <td className="max-w-[240px] truncate">{row.user_email}</td>
                    <td className="font-mono">{row.ktp || "-"}</td>
                    <td className="font-mono">{row.npwp || "-"}</td>
                    <td>{fileLink(row.file_ktp)}</td>
                    <td>{fileLink(row.file_kk)}</td>
                    <td>{fileLink(row.file_sign)}</td>
                    <td>{fileLink(row.file_photo)}</td>
                    <td>
                      <StatusBadge value={row.verification_status} />
                    </td>
                    <td>
                      {moment(row.updated_at).format("DD MMM YYYY HH:mm")}
                    </td>
                    <td className="flex">
                      <button
                        className="text-blue-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-detail"
                        onClick={() => openDetailUser(row.user_id)}
                      >
                        Detail
                      </button>

                      {(() => {
                        const s = String(
                          row.verification_status || ""
                        ).toLowerCase();
                        const canAction = !["approved", "rejected"].includes(s); // hanya muncul kalau belum final
                        if (!canAction) return null;

                        return (
                          <>
                            <button
                              className="text-blue-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-add"
                              onClick={() => askApprove(row)}
                            >
                              Setujui
                            </button>
                            <button
                              className="text-blue-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-deletep"
                              onClick={() => askReject(row)}
                            >
                              Tolak
                            </button>
                          </>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
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

export default IdentityVerifications;
