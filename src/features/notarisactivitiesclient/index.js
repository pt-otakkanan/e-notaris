// src/features/notarisactivitiesclient/index.jsx
import moment from "moment";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { setPageTitle } from "../common/headerSlice";
import {
  MODAL_BODY_TYPES,
  CONFIRMATION_MODAL_CLOSE_TYPES,
} from "../../utils/globalConstantUtil";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { showNotification } from "../common/headerSlice";

import {
  getNotarisActivitiesContent,
  approveClientActivity,
  rejectClientActivity,
  setClientLastQuery,
} from "./notarisActivitiesSlice";

function NotarisActivitiesClient() {
  const dispatch = useDispatch();
  const {
    items = [],
    isLoading = false,
    meta,
    lastQuery = { page: 1, search: "" },
  } = useSelector((state) => state.notarisActivitiesClient || {});

  const [query, setQuery] = useState(lastQuery.search || "");

  useEffect(() => {
    dispatch(setPageTitle("Aktivitas Notaris - Penghadap"));
    dispatch(getNotarisActivitiesContent(lastQuery));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Get user email =====
  const myEmail =
    (typeof window !== "undefined" &&
      window.localStorage.getItem("user_email")) ||
    "";
  const myEmailLc = myEmail.trim().toLowerCase();

  // ===== Pagination Actions =====
  const refetch = (q) => dispatch(getNotarisActivitiesContent(q));

  const onSearch = () => {
    const q = { ...lastQuery, page: 1, search: query };
    dispatch(setClientLastQuery(q));
    refetch(q);
  };

  const changePage = (page) => {
    if (!meta) return;
    const p = Math.max(1, Math.min(page, meta.last_page || 1));
    const q = { ...lastQuery, page: p, search: query };
    dispatch(setClientLastQuery(q));
    refetch(q);
  };

  // ===== Helpers =====
  const mapApprovalStatus = (s) => {
    const k = String(s || "").toLowerCase();
    if (k === "approved") return "Disetujui";
    if (k === "pending") return "Menunggu";
    if (k === "rejected") return "Ditolak";
    return "Tidak diketahui";
  };

  const renderStatusBadge = (status) => {
    const cls =
      {
        Selesai:
          "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
        Draft:
          "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
        Menunggu:
          "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
        Ditolak:
          "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
      }[status] || "badge-ghost";
    return (
      <div className={`badge ${cls} whitespace-nowrap`}>
        {status || "Tidak diketahui"}
      </div>
    );
  };

  const renderApprovalBadge = (label) => {
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

  // ===== Function to get dynamic labels for each row =====
  const getDynamicLabels = (row) => {
    const firstEmail =
      (row.first_client && row.first_client.email) ||
      row.penghadap1_email ||
      row.first_client_email ||
      "";
    const secondEmail =
      (row.second_client && row.second_client.email) ||
      row.penghadap2_email ||
      row.second_client_email ||
      "";

    const isMeFirst =
      myEmailLc && String(firstEmail).trim().toLowerCase() === myEmailLc;
    const isMeSecond =
      myEmailLc && String(secondEmail).trim().toLowerCase() === myEmailLc;

    return {
      penghadap1Label: isMeFirst ? "Anda" : row.penghadap1,
      penghadap2Label: isMeSecond ? "Anda" : row.penghadap2,
      statusPenghadap1Label: isMeFirst ? "Status Anda" : "Status Penghadap 1",
      statusPenghadap2Label: isMeSecond ? "Status Anda" : "Status Penghadap 2",
      isMeFirst,
      isMeSecond,
    };
  };

  // ===== Modals =====
  const openDetail = (row) => {
    dispatch(
      openModal({
        title: "Detail Aktivitas Notaris",
        bodyType: MODAL_BODY_TYPES.NOTARIS_ACTIVITY_DETAIL,
        extraObject: row.id, // fetch detail fresh di modal body
        size: "lg",
      })
    );
  };

  const openScheduleDetail = (row) => {
    dispatch(
      openModal({
        title: "Detail Penjadwalan",
        bodyType: MODAL_BODY_TYPES.NOTARIS_ACTIVITY_SCHEDULE_DETAIL,
        extraObject: {
          activity: row,
          schedule: {
            scheduledDate: row.scheduled_date,
            location: row.schedule_location,
            notes: row.schedule_notes,
            status: row.schedule_status || "confirmed",
          },
        },
        size: "lg",
      })
    );
  };

  const approveVerification = (row) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Yakin ingin menyetujui aktivitas ini?",
          type: "IDV_APPROVE",
          onConfirm: async () => {
            try {
              await dispatch(approveClientActivity({ id: row.id })).unwrap();
              dispatch(getNotarisActivitiesContent(lastQuery));

              // NOTIFIKASI BERHASIL
              dispatch(
                showNotification({
                  message: "Aktivitas berhasil disetujui!",
                  status: 1,
                })
              );

              return { closeType: CONFIRMATION_MODAL_CLOSE_TYPES.OK };
            } catch (error) {
              // Error sudah ditangani di ConfirmationModalBody
              throw error;
            }
          },
        },
      })
    );
  };

  const rejectVerification = (row) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Yakin ingin menolak aktivitas ini?",
          type: "IDV_APPROVE",
          onConfirm: async (reason) => {
            try {
              await dispatch(
                rejectClientActivity({
                  id: row.id,
                  reason: reason,
                })
              ).unwrap();
              dispatch(getNotarisActivitiesContent(lastQuery));

              // NOTIFIKASI BERHASIL
              dispatch(
                showNotification({
                  message: "Aktivitas berhasil ditolak!",
                  status: 1,
                })
              );

              return { closeType: CONFIRMATION_MODAL_CLOSE_TYPES.OK };
            } catch (error) {
              // Error sudah ditangani di ConfirmationModalBody
              throw error;
            }
          },
        },
      })
    );
  };

  // ===== Schedule cell =====
  const renderScheduleInfo = (row) => {
    const hasSchedule = row.scheduled_date;
    if (hasSchedule) {
      return (
        <div className="flex flex-col items-center gap-1">
          <button
            className="link link-primary text-sm flex items-center gap-1"
            onClick={() => openScheduleDetail(row)}
          >
            <CalendarIcon className="w-4 h-4" />
            Lihat
          </button>
          <div className="text-xs text-gray-600 whitespace-nowrap">
            {moment(row.scheduled_date).format("DD MMM")}
          </div>
          <div className="text-xs text-gray-600 whitespace-nowrap">
            {moment(row.scheduled_date).format("HH:mm")}
          </div>
        </div>
      );
    }
    return (
      <div className="text-center text-gray-400 text-sm">
        <CalendarIcon className="w-4 h-4 mx-auto mb-1 opacity-50" />
        <div className="whitespace-nowrap">Belum dijadwalkan</div>
      </div>
    );
  };

  // ===== Filter pencarian =====
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const fields = [
        it.kode,
        it.nama,
        it.jenis_akta,
        it.penghadap1,
        it.penghadap2,
        it.status,
        it.status_penghadap1,
        it.status_penghadap2,
      ];
      return fields.some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [items, query]);

  // ===== Search bar =====
  const TopSideButtons = (
    <div className="flex items-center">
      <div className="join">
        <input
          type="text"
          className="input input-sm input-bordered join-item w-[280px]"
          placeholder="Cari kode, nama, jenis akta, atau penghadap..."
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
      {query ? (
        <button className="btn btn-sm btn-ghost" onClick={() => setQuery("")}>
          Reset
        </button>
      ) : null}
    </div>
  );

  if (isLoading) {
    return (
      <TitleCard
        title="Aktivitas Notaris - Penghadap"
        topMargin="mt-2"
        TopSideButtons={TopSideButtons}
      >
        <div className="p-6 text-center">Memuat data…</div>
      </TitleCard>
    );
  }

  return (
    <TitleCard
      title="Aktivitas Notaris - Penghadap"
      topMargin="mt-2"
      TopSideButtons={TopSideButtons}
    >
      {filtered.length === 0 ? (
        <div className="p-6 text-center opacity-70">
          {query ? (
            <>
              Tidak ada hasil untuk "
              <span className="font-semibold">{query}</span>"
            </>
          ) : (
            "Belum ada data."
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto w-full">
            <table className="table w-full [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap">
              <thead>
                <tr className="text-center">
                  <th>Kode</th>
                  <th>Nama</th>
                  <th>Jenis Akta</th>
                  <th>Penghadap 1</th>
                  <th>Status Penghadap 1</th>
                  <th>Penghadap 2</th>
                  <th>Status Penghadap 2</th>
                  <th>Dokumen Tambahan</th>
                  <th>Draft Akta</th>
                  <th>Penjadwalan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const {
                    penghadap1Label,
                    penghadap2Label,
                    isMeFirst,
                    isMeSecond,
                  } = getDynamicLabels(row);

                  // Label status persetujuan untuk tampilan
                  const sp1 =
                    row.status_penghadap1 ||
                    mapApprovalStatus(
                      row.status_penghadap1_raw || row.first_client_approval
                    );

                  const sp2 =
                    row.status_penghadap2 ||
                    mapApprovalStatus(
                      row.status_penghadap2_raw || row.second_client_approval
                    );

                  const hasSecond =
                    !!row.penghadap2 && String(row.penghadap2).trim() !== "-";

                  // Approval milik user login
                  const myApprovalRaw = isMeFirst
                    ? String(
                        row.status_penghadap1_raw ||
                          row.first_client_approval ||
                          ""
                      ).toLowerCase()
                    : isMeSecond
                    ? String(
                        row.status_penghadap2_raw ||
                          row.second_client_approval ||
                          ""
                      ).toLowerCase()
                    : "";

                  // Sembunyikan tombol jika:
                  // - user bukan first/second pada aktivitas INI, atau
                  // - approval milik user sudah bukan 'pending'
                  const hideActionButtons =
                    (!isMeFirst && !isMeSecond) ||
                    (myApprovalRaw && myApprovalRaw !== "pending");

                  return (
                    <tr key={row.id}>
                      <td className="font-mono">{row.kode}</td>
                      <td>{row.nama}</td>
                      <td>{row.jenis_akta}</td>
                      <td>
                        {isMeFirst ? (
                          <span className="font-semibold text-blue-600">
                            {penghadap1Label}
                          </span>
                        ) : (
                          penghadap1Label
                        )}
                      </td>
                      <td>{renderApprovalBadge(sp1)}</td>
                      <td>
                        {hasSecond ? (
                          isMeSecond ? (
                            <span className="font-semibold text-blue-600">
                              {penghadap2Label}
                            </span>
                          ) : (
                            penghadap2Label
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {hasSecond ? (
                          renderApprovalBadge(sp2)
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td>
                        <Link
                          to="/app/document-requirement"
                          className="link link-primary inline-block"
                          rel="noreferrer"
                        >
                          Lihat
                        </Link>
                      </td>
                      <td>
                        {row.draft_akta ? (
                          <a
                            href={row.draft_akta}
                            className="link link-primary inline-block"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Lihat
                          </a>
                        ) : (
                          <span className="opacity-60">-</span>
                        )}
                      </td>
                      <td className="text-center">{renderScheduleInfo(row)}</td>
                      <td>{renderStatusBadge(row.status)}</td>
                      <td className="flex flex-nowrap items-center">
                        <button
                          className="text-green-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-detail"
                          onClick={() => openDetail(row)}
                        >
                          Detail
                        </button>

                        {/* TOMBOL AKSI: tampil hanya jika email user match dan approval masih pending */}
                        {!hideActionButtons && (
                          <>
                            <button
                              className="text-green-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-add"
                              onClick={() => approveVerification(row)}
                            >
                              Setujui
                            </button>
                            <button
                              className="text-green-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-delete"
                              onClick={() => rejectVerification(row)}
                            >
                              Tolak
                            </button>
                          </>
                        )}
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

export default NotarisActivitiesClient;
