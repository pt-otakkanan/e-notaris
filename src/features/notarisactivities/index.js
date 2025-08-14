import moment from "moment";
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
import {
  getNotarisActivitiesContent,
  deleteNotarisActivity,
} from "./notarisActivitiesSlice";

function NotarisActivities() {
  const { items = [], isLoading = false } = useSelector(
    (state) => state.notarisActivities || {}
  );
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(setPageTitle("Aktivitas Notaris"));
    dispatch(getNotarisActivitiesContent());
  }, [dispatch]);

  // Buka modal detail
  const openDetail = (row) => {
    dispatch(
      openModal({
        title: "Detail Aktivitas Notaris",
        bodyType: MODAL_BODY_TYPES.NOTARIS_ACTIVITY_DETAIL,
        extraObject: row,
        size: "lg",
      })
    );
  };

  // Edit activity
  const openEdit = (row) => {
    dispatch(
      openModal({
        title: "Edit Aktivitas Notaris",
        bodyType: MODAL_BODY_TYPES.USER_EDIT, // ganti sesuai modal edit yang ada
        extraObject: row,
        size: "lg",
      })
    );
  };

  // Hapus activity
  const askDelete = (index) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Yakin ingin menghapus aktivitas ini?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE,
          index,
        },
      })
    );
  };

  const renderStatusBadge = (status) => {
    const cls =
      {
        Selesai:
          "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
        Draft:
          "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
        Menunggu:
          "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
      }[status] || "badge-ghost";
    return <div className={`badge ${cls}`}>{status || "Tidak diketahui"}</div>;
  };

  // Filter pencarian
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const fields = [
        it.kode,
        it.jenis_akta,
        it.penghadap1,
        it.penghadap2,
        it.status,
      ];
      return fields.some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [items, query]);

  // Search bar
  const TopSideButtons = (
    <div className="flex items-center gap-2">
      <div className="join">
        <input
          type="text"
          className="input input-sm input-bordered join-item w-[280px]"
          placeholder="Cari kode, jenis akta, atau penghadap..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-sm join-item"
          onClick={() => setQuery(query)}
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
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Jenis Akta</th>
                <th>Penghadap 1</th>
                <th>Penghadap 2</th>
                <th>Draft Akta</th>
                <th>Status</th>
                {/* <th>Waktu</th> */}
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, k) => (
                <tr key={row.id ?? k}>
                  <td className="font-mono">{row.kode}</td>
                  <td>{row.jenis_akta}</td>
                  <td>{row.penghadap1}</td>
                  <td>{row.penghadap2}</td>
                  <td>
                    <a
                      href={row.draft_akta}
                      className="link link-primary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lihat
                    </a>
                  </td>
                  <td>{renderStatusBadge(row.status)}</td>
                  {/* <td>
                    {moment(row.waktu || new Date()).format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </td> */}
                  <td className="flex">
                    <button
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                      onClick={() => openDetail(row)}
                    >
                      Detail
                    </button>
                    <button
                      className="text-yellow-700 hover:text-white border border-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 dark:border-yellow-500 dark:text-yellow-500 dark:hover:text-white dark:hover:bg-yellow-600 dark:focus:ring-yellow-800"
                      onClick={() => openEdit(row)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-800"
                      onClick={() => askDelete(k)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TitleCard>
  );
}

export default NotarisActivities;
