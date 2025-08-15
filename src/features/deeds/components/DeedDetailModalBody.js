import { Link } from "react-router-dom";
import moment from "moment";

export default function DeedDetailModalBody({ extraObject = {}, closeModal }) {
  const {
    id,
    nama,
    deskripsi,
    jumlah_penghadap,
    dokumen_tambahan = [],
    created_at,
  } = extraObject || {};

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm opacity-70">Nama</div>
        <div className="font-semibold text-lg">{nama}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Jumlah Penghadap</div>
          <div className="font-medium">{jumlah_penghadap ?? "-"}</div>
        </div>

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Dibuat</div>
          <div className="font-medium">
            {moment(created_at || new Date()).format("DD MMM YYYY HH:mm")}
          </div>
        </div>

        <div className="rounded-lg p-3 bg-base-200 md:col-span-2">
          <div className="text-xs opacity-70 mb-1">Deskripsi</div>
          <div className="font-medium whitespace-pre-wrap">
            {deskripsi || "-"}
          </div>
        </div>
      </div>

      <div className="rounded-lg p-3 bg-base-200">
        <div className="text-xs opacity-70 mb-2">Dokumen Tambahan</div>
        {dokumen_tambahan.length === 0 ? (
          <div className="opacity-60">Tidak ada dokumen.</div>
        ) : (
          <ul className="list-disc ml-5 space-y-1">
            {dokumen_tambahan.map((d, i) => (
              <li key={i}>
                <span className="font-medium">{d.name}</span> —{" "}
                <Link
                  to={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link link-primary"
                >
                  Lihat
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button className="btn" onClick={closeModal}>
          Tutup
        </button>
      </div>
    </div>
  );
}
