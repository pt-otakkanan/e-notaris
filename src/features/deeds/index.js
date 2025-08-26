// src/features/deed/index.jsx
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { setPageTitle, showNotification } from "../common/headerSlice";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { openModal } from "../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { fetchDeeds, deleteDeedById, setLastQuery } from "./deedSlice";

function Deeds() {
  const dispatch = useDispatch();

  const {
    items = [],
    isLoading = false,
    meta,
    lastQuery,
  } = useSelector((s) => s.deed || {});

  const [query, setQuery] = useState(lastQuery.search || "");

  useEffect(() => {
    dispatch(setPageTitle("Akta Otentik"));
    dispatch(fetchDeeds(lastQuery));
    // eslint-disable-next-line
  }, []);

  const onSearch = () => {
    const q = { ...lastQuery, page: 1, search: query };
    dispatch(setLastQuery(q));
    dispatch(fetchDeeds(q));
  };

  const changePage = (page) => {
    if (!meta) return;
    const p = Math.max(1, Math.min(page, meta.last_page || 1));
    const q = { ...lastQuery, page: p };
    dispatch(setLastQuery(q));
    dispatch(fetchDeeds(q));
  };

  const openDetail = (row) => {
    dispatch(
      openModal({
        title: "Detail Akta",
        bodyType: MODAL_BODY_TYPES.DEED_DETAIL,
        extraObject: row, // atau id row.id kalau modal mau fetch sendiri
        size: "lg",
      })
    );
  };

  const openAddModal = () => {
    dispatch(
      openModal({
        title: "Tambah Akta",
        bodyType: MODAL_BODY_TYPES.DEED_ADD, // (opsional) kalau kamu sudah punya modal add/edit
      })
    );
  };

  const addRequirement = (row) => {
    dispatch(
      openModal({
        title: "Tambah Data Tambahan",
        bodyType: MODAL_BODY_TYPES.DEED_ADD_REQUIREMENT,
        extraObject: row, // minimal butuh row.id
        size: "md",
      })
    );
  };

  const askDelete = (row) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Yakin ingin menghapus akta "${row.nama}"?`,
          // ⬇️ warning merah di bawah pesan utama
          warning:
            "Semua yang berhubungan dengan akta otentik ini akan dihapus.",
          type: "DEED_DELETE",
          onConfirm: async () => {
            await dispatch(deleteDeedById(row.id));
            dispatch(
              showNotification({ message: "Akta berhasil dihapus", status: 1 })
            );
          },
        },
      })
    );
  };

  const TopSideButtons = (
    <div className="flex items-center gap-2">
      <div className="join">
        <input
          type="text"
          className="input input-sm input-bordered join-item w-[300px]"
          placeholder="Cari nama atau deskripsi…"
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
        title="Akta Otentik"
        topMargin="mt-2"
        TopSideButtons={TopSideButtons}
      >
        <div className="p-10 flex flex-col items-center justify-center gap-3">
          <div className="text-sm opacity-70">Memuat data…</div>
        </div>
      </TitleCard>
    );
  }

  return (
    <TitleCard
      title="Akta Otentik"
      topMargin="mt-2"
      TopSideButtons={TopSideButtons}
    >
      {items.length === 0 ? (
        <div className="p-6 text-center opacity-70">Tidak ada data.</div>
      ) : (
        <>
          <div className="overflow-x-auto w-full">
            <table className="table w-full [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Deskripsi</th>
                  <th>Jumlah Penghadap</th>
                  <th>Data Tambahan</th>
                  <th>Dibuat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    <td className="font-medium">{row.nama}</td>
                    <td className="max-w-[420px]">
                      <span title={row.deskripsi || ""}>
                        {row.deskripsi
                          ? row.deskripsi.length > 50
                            ? row.deskripsi.slice(0, 30) + "…"
                            : row.deskripsi
                          : "-"}
                      </span>
                    </td>
                    <td className="text-center">{row.jumlah_penghadap}</td>
                    <td className="space-x-1 space-y-1">
                      {!row.dokumen_tambahan?.length ? (
                        <span className="badge badge-ghost">-</span>
                      ) : (
                        <>
                          {row.dokumen_tambahan.slice(0, 3).map((d, i) => (
                            <span
                              key={d.id ?? i}
                              className="badge badge-outline"
                            >
                              {d.name}
                            </span>
                          ))}

                          {row.dokumen_tambahan.length > 3 && (
                            <span
                              className="badge badge-ghost"
                              title="Lihat selengkapnya di Detail"
                            >
                              +{row.dokumen_tambahan.length - 3} lagi
                            </span>
                          )}
                        </>
                      )}
                    </td>

                    <td className="whitespace-nowrap">
                      {moment(row.created_at || new Date()).format(
                        "DD MMM YYYY"
                      )}
                    </td>
                    <td>
                      <button
                        className="text-green-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-add"
                        onClick={() => addRequirement(row)}
                      >
                        Tambah Data
                      </button>
                      <button
                        className="text-blue-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-detail"
                        onClick={() => openDetail(row)}
                      >
                        Detail
                      </button>
                      <button
                        className="text-red-7 rounded-lg text-sm px-3 py-1.5 me-2 bg-delete"
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

export default Deeds;
