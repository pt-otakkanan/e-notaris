import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { setPageTitle } from "../common/headerSlice";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { openModal } from "../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { getDeedsContent, deleteDeed } from "./deedSlice";

function Deeds() {
  const { items = [], isLoading = false } = useSelector((s) => s.deed || {});
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(setPageTitle("Daftar Akta (Deeds)"));
    dispatch(getDeedsContent());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((d) => {
      const extras = (d.dokumen_tambahan || []).map((x) => x.name).join(" ");
      return [d.nama, d.deskripsi, String(d.jumlah_penghadap), extras]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, query]);

  const openDetail = (row) => {
    dispatch(
      openModal({
        title: "Detail Akta",
        bodyType: MODAL_BODY_TYPES.DEED_DETAIL,
        extraObject: row,
        size: "lg",
      })
    );
  };

  const addRequirement = (row) => {
    dispatch(
      openModal({
        title: "Tambah Dokumen Tambahan",
        bodyType: MODAL_BODY_TYPES.DEED_ADD_REQUIREMENT,
        extraObject: row,
        size: "md",
      })
    );
  };

  const askDelete = (index) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Yakin ingin menghapus akta ini?",
          type: "DEED_DELETE",
          index,
          onConfirm: () => dispatch(deleteDeed({ index })),
        },
      })
    );
  };

  // Top-right search
  const TopSideButtons = (
    <div className="flex items-center gap-2">
      <div className="join">
        <input
          type="text"
          className="input input-sm input-bordered join-item w-[300px]"
          placeholder="Cari nama, deskripsi, dokumen tambahan…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-sm join-item" type="button">
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

  if (isLoading) {
    return (
      <TitleCard
        title="Akta Otentik"
        topMargin="mt-2"
        TopSideButtons={TopSideButtons}
      >
        <div className="p-6 text-center">Memuat data…</div>
      </TitleCard>
    );
  }

  return (
    <TitleCard
      title="Akta Otentik"
      topMargin="mt-2"
      TopSideButtons={TopSideButtons}
    >
      {filtered.length === 0 ? (
        <div className="p-6 text-center opacity-70">
          {query ? (
            <>
              Tidak ada hasil untuk "<b>{query}</b>"
            </>
          ) : (
            "Belum ada data akta."
          )}
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="table min-w-[1000px]">
            <thead>
              <tr>
                <th className="whitespace-nowrap">Nama</th>
                <th className="whitespace-nowrap">Deskripsi</th>
                <th className="whitespace-nowrap">Jumlah Penghadap</th>
                <th className="whitespace-nowrap">Dokumen Tambahan</th>
                <th className="whitespace-nowrap">Dibuat</th>
                <th className="whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, k) => (
                <tr key={row.id ?? k}>
                  <td className="font-medium">{row.nama}</td>
                  <td className="max-w-[420px]">{row.deskripsi}</td>
                  <td className="text-center">{row.jumlah_penghadap}</td>
                  <td className="space-x-1 space-y-1">
                    {(row.dokumen_tambahan || []).length === 0 ? (
                      <span className="badge badge-ghost">-</span>
                    ) : (
                      (row.dokumen_tambahan || []).map((d, i) => (
                        <span key={i} className="badge badge-outline">
                          {d.name}
                        </span>
                      ))
                    )}
                  </td>
                  <td className="whitespace-nowrap">
                    {moment(row.created_at || new Date()).format("DD MMM YYYY")}
                  </td>
                  <td className="">
                    <button
                      className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                      onClick={() => addRequirement(k)}
                    >
                      Tambah Dokumen
                    </button>
                    <button
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                      onClick={() => openDetail(k)}
                    >
                      Detail
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

export default Deeds;
