import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { openModal } from "../common/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { setPageTitle } from "../common/headerSlice";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { getIdentityVerificationsContent } from "./identityVerificationSlice";

function IdentityVerifications() {
  const { items = [], isLoading = false } = useSelector(
    (state) => state.identityVerification || {}
  );
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(setPageTitle("Verifikasi Identitas"));
    dispatch(getIdentityVerificationsContent());
  }, [dispatch]);

  const approveVerification = (row) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Yakin ingin menyetujui verifikasi atas nama ${row.first_name} ${row.last_name}?`,
          type: "IDV_APPROVE",
          row,
        },
      })
    );
  };

  const rejectVerification = (index) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Yakin ingin menolak verifikasi ini?`,
          type: "IDV_REJECT",
          index,
        },
      })
    );
  };

  // filter client-side
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const name = `${it.first_name} ${it.last_name}`;
      const fields = [name, it.nik, it.npwp];
      return fields.some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [items, query]);

  // top-right search
  const TopSideButtons = (
    <div className="flex items-center gap-2">
      <div className="join">
        <input
          type="text"
          className="input input-sm input-bordered join-item w-[280px]"
          placeholder="Cari nama, NIK, atau NPWP..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-sm join-item"
          onClick={() => setQuery(query)}
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

  if (isLoading) {
    return (
      <TitleCard
        title="Verifikasi Identitas"
        topMargin="mt-2"
        TopSideButtons={TopSideButtons}
      >
        <div className="p-6 text-center">Memuat data…</div>
      </TitleCard>
    );
  }

  return (
    <TitleCard
      title="Verifikasi Identitas"
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
            "Belum ada data verifikasi."
          )}
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama</th>
                <th>NIK</th>
                <th>KTP</th>
                <th>KK</th>
                <th>NPWP</th>
                <th>TTD</th>
                <th>Waktu Upload</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, k) => {
                const name = `${row.first_name} ${row.last_name}`;
                return (
                  <tr key={row.id ?? k}>
                    <td>{name}</td>
                    <td className="font-mono">{row.nik}</td>

                    <td>
                      <a
                        className="link link-primary"
                        href={row.ktp}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Lihat
                      </a>
                    </td>

                    <td>
                      <a
                        className="link link-primary"
                        href={row.kk}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Lihat
                      </a>
                    </td>

                    <td className="font-mono">{row.npwp}</td>

                    <td>
                      <a
                        className="link link-primary"
                        href={row.tanda_tangan}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Lihat
                      </a>
                    </td>

                    <td>
                      {moment(row.uploaded_at || new Date()).format(
                        "DD MMM YYYY HH:mm"
                      )}
                    </td>

                    <td className="flex">
                      <button
                        className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                        onClick={() => approveVerification(row)} // fungsi setujui
                      >
                        Setujui
                      </button>
                      <button
                        className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-800"
                        onClick={() => rejectVerification(k)} // fungsi tolak
                      >
                        Tolak
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

export default IdentityVerifications;
