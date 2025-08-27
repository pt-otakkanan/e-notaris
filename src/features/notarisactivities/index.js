// src/features/notaris-activities/index.jsx
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { setPageTitle, showNotification } from "../common/headerSlice";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ScheduleService from "../../services/schedule.service";
import {
  fetchNotarisActivities,
  deleteNotarisActivityById,
  setLastQuery,
} from "./notarisActivitiesSlice";

function NotarisActivities() {
  const dispatch = useDispatch();
  const {
    items = [],
    isLoading = false,
    meta,
    lastQuery,
  } = useSelector((s) => s.notarisActivities || {});

  const [query, setQuery] = useState(lastQuery.search || "");
  const [statusTab, setStatusTab] = useState(lastQuery.status || "");

  useEffect(() => {
    dispatch(setPageTitle("Aktivitas Notaris"));
    dispatch(fetchNotarisActivities(lastQuery));
    // eslint-disable-next-line
  }, []);

  // actions
  const refetch = (q) => dispatch(fetchNotarisActivities(q));

  const onSearch = () => {
    const q = { ...lastQuery, page: 1, search: query, status: statusTab };
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

  // detail
  const openDetail = (row) => {
    // bisa kirim id supaya modal fetch fresh detail
    dispatch(
      openModal({
        title: "Detail Aktivitas Notaris",
        bodyType: MODAL_BODY_TYPES.NOTARIS_ACTIVITY_DETAIL,
        extraObject: row.id,
        size: "lg",
      })
    );
  };

  // add
  // di NotarisActivities()
  const openAddModal = () => {
    dispatch(
      openModal({
        title: "Tambah Aktivitas Notaris",
        bodyType: MODAL_BODY_TYPES.NOTARIS_ACTIVITY_ADD,
        size: "lg",
        extraObject: {
          onCreated: () => {
            // refetch pakai query terakhir agar filter/pagination tetap konsisten
            dispatch(fetchNotarisActivities(lastQuery));
          },
        },
      })
    );
  };
  // edit
  const openEdit = (row) => {
    dispatch(
      openModal({
        title: "Edit Aktivitas Notaris",
        bodyType: MODAL_BODY_TYPES.NOTARIS_ACTIVITY_EDIT,
        extraObject: {
          ...row, // kirim semua data row untuk initial values
          onUpdated: () => {
            // refetch pakai query terakhir agar filter/pagination tetap konsisten
            dispatch(fetchNotarisActivities(lastQuery));
          },
        },
        size: "lg",
      })
    );
  };

  // Update handler openScheduleModal di NotarisActivities
  const openScheduleModal = (row) => {
    dispatch(
      openModal({
        title: "Penjadwalan Aktivitas",
        bodyType: MODAL_BODY_TYPES.NOTARIS_ACTIVITY_SCHEDULE,
        extraObject: {
          activity: row,
          existingSchedule: row.scheduled_date || null,
          onSubmit: async (scheduleData) => {
            try {
              const {
                activityId,
                scheduledDate,
                scheduledTime,
                location,
                notes,
                isUpdate,
                isDelete,
              } = scheduleData;

              if (isDelete) {
                // Handle delete schedule - sesuaikan dengan API Anda
                // Misalnya ada endpoint DELETE /schedule/by-activity/{activityId}
                // atau update activity dengan null schedule
                await ScheduleService.deleteByActivityId?.(activityId);
              } else if (isUpdate) {
                // Update existing schedule
                // Asumsikan ada schedule_id di row atau perlu cari dulu
                console.log(row);
                const scheduleId = row.schedule_id; // sesuaikan dengan struktur data
                await ScheduleService.update(scheduleId, {
                  activity_id: activityId,
                  date: scheduledDate,
                  time: scheduledTime,
                  location,
                  notes,
                });
              } else {
                // Create new schedule
                await ScheduleService.create({
                  activity_id: activityId,
                  date: scheduledDate,
                  time: scheduledTime,
                  location,
                  notes,
                });
              }

              dispatch(
                showNotification({
                  message: isDelete
                    ? "Jadwal berhasil dihapus"
                    : isUpdate
                    ? "Jadwal berhasil diperbarui"
                    : "Jadwal berhasil disimpan",
                  status: 1,
                })
              );

              // Refetch data
              dispatch(fetchNotarisActivities(lastQuery));
            } catch (error) {
              console.error("Error handling schedule:", error);
              dispatch(
                showNotification({
                  message: "Terjadi kesalahan saat menyimpan jadwal",
                  status: 0,
                })
              );
            }
          },
        },
        size: "lg",
      })
    );
  };

  // delete by id + warning
  const askDelete = (row) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Yakin ingin menghapus aktivitas ${row.kode}?`,
          warning:
            "Semua data terkait (dokumen persyaratan, draft, dan jadwal) akan dihapus.",
          type: "NOTARIS_ACTIVITY_DELETE",
          onConfirm: async () => {
            await dispatch(deleteNotarisActivityById(row.id)).unwrap();
            dispatch(
              showNotification({
                message: "Aktivitas berhasil dihapus",
                status: 1,
              })
            );
          },
        },
      })
    );
  };

  // status badge untuk status utama
  const renderStatusBadge = (label) => {
    const cls =
      {
        Selesai:
          "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
        Menunggu:
          "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
        Ditolak:
          "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
      }[label] || "badge-ghost";
    return <div className={`badge ${cls}`}>{label || "Tidak diketahui"}</div>;
  };

  // status badge untuk persetujuan penghadap
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

  const renderScheduleButton = (row) => {
    const hasSchedule = !!row.scheduled_date;
    if (hasSchedule) {
      return (
        <div className="flex flex-col items-center gap-1">
          <button
            className="text-green-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-add"
            onClick={() => openScheduleModal(row)}
          >
            Terjadwal
          </button>
        </div>
      );
    }
    return (
      <button
        className="text-green-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-detail"
        onClick={() => openScheduleModal(row)}
      >
        Jadwalkan
      </button>
    );
  };

  // client-side filter tambahan (optional – biasanya sudah di server)
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

  // top controls
  const TopSideButtons = (
    <div className="flex items-center gap-2">
      {/* Tabs status (server-side filter) */}
      <div className="join hidden md:inline-flex">
        {[
          { v: "", label: "Semua" },
          { v: "pending", label: "Menunggu" },
          { v: "approved", label: "Disetujui" },
          { v: "rejected", label: "Ditolak" },
        ].map((t) => (
          <button
            key={t.v || "all"}
            className={`btn btn-sm join-item hover:bg-[#0256c4] ${
              statusTab === t.v ? "bg-[#0256c4] text-white" : "btn-outline"
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
          placeholder="Cari kode, jenis akta, penghadap…"
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

      <button
        className="btn btn-sm bg-[#0256c4] text-white"
        onClick={openAddModal}
      >
        Tambah
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <TitleCard
        title="Aktivitas Notaris"
        topMargin="mt-2"
        TopSideButtons={TopSideButtons}
      >
        <div className="p-6 text-center">Memuat data…</div>
      </TitleCard>
    );
  }

  return (
    <TitleCard
      title="Aktivitas Notaris"
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
                <tr>
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
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td className="font-mono">{row.kode}</td>
                    <td>{row.nama}</td>
                    <td>{row.jenis_akta}</td>
                    <td>{row.penghadap1}</td>
                    <td>{renderApprovalBadge(row.status_penghadap1)}</td>
                    <td>{row.penghadap2 || "-"}</td>
                    <td>
                      {row.penghadap2 && row.penghadap2 !== "-" ? (
                        renderApprovalBadge(row.status_penghadap2)
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to="/app/document-requirement"
                        className="link link-primary"
                      >
                        Lihat
                      </Link>
                    </td>
                    <td>
                      {row.draft_akta ? (
                        <a
                          href={row.draft_akta}
                          className="link link-primary"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Lihat
                        </a>
                      ) : (
                        <span className="opacity-60">-</span>
                      )}
                    </td>
                    <td className="text-center">{renderScheduleButton(row)}</td>
                    <td>{renderStatusBadge(row.status)}</td>
                    <td className="flex">
                      <button
                        className="text-green-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-detail"
                        onClick={() => openDetail(row)}
                      >
                        Detail
                      </button>
                      <button
                        className="text-green-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-add"
                        onClick={() => openEdit(row)}
                        disabled={
                          String(row.status).toLowerCase() === "selesai"
                        } // opsional: kunci edit saat approved
                      >
                        Edit
                      </button>
                      <button
                        className="text-green-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-delete"
                        onClick={() => askDelete(row)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

export default NotarisActivities;
