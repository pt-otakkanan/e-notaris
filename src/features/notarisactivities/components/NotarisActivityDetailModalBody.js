// src/components/ModalBodies/NotarisActivityDetailModalBody.jsx
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import NotarisActivityService from "../../../services/notarisActivity.service";

export default function NotarisActivityDetailModalBody({
  extraObject = null,
  closeModal,
}) {
  // `extraObject` berisi id aktivitas (kirim dari openDetail(row.id))
  const id = typeof extraObject === "number" ? extraObject : extraObject?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const res = await NotarisActivityService.detail(id);
        if (alive) setData(res?.data || null);
      } catch (e) {
        if (alive)
          setError(e?.response?.data?.message || "Gagal memuat detail.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [id]);

  const renderStatusBadge = (s) => {
    const cls =
      {
        pending:
          "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
        approved:
          "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
        rejected:
          "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
      }[String(s || "").toLowerCase()] || "badge badge-ghost";
    const label =
      { pending: "Menunggu", approved: "Disetujui", rejected: "Ditolak" }[
        String(s || "").toLowerCase()
      ] ||
      s ||
      "-";
    return <span className={cls}>{label}</span>;
  };

  // Helper component untuk menampilkan file identitas
  const IdentityFileLink = ({ fileUrl, label }) => {
    if (!fileUrl) return <span className="opacity-60">-</span>;

    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="link link-primary text-sm"
      >
        {label}
      </a>
    );
  };

  const view = useMemo(() => {
    if (!data) return null;

    const deed = data.deed || {};
    const first = data.first_client || null;
    const second = data.second_client || null;

    // helper aman-nul
    const get = (obj, ...keys) =>
      keys.reduce((v, k) => (v && v[k] != null ? v[k] : null), obj);

    const penghadap1Data = {
      name: get(first, "name") || "-",
      email: get(first, "email") || "-",
      nik: get(first, "identity", "ktp") || "-",
      telepon: get(first, "telepon") || get(first, "phone") || "-",
      address: get(first, "address") || "-",
      npwp: get(first, "identity", "npwp") || "-",
      approval_status: data.first_client_approval || "pending",
      // File identitas
      file_ktp: get(first, "identity", "file_ktp") || null,
      file_kk: get(first, "identity", "file_kk") || null,
      file_npwp: get(first, "identity", "file_npwp") || null,
      file_photo: get(first, "identity", "file_photo") || null,
      file_sign: get(first, "identity", "file_sign") || null,
    };

    const penghadap2Data = second
      ? {
          name: get(second, "name") || "-",
          email: get(second, "email") || "-",
          nik: get(second, "identity", "ktp") || "-",
          telepon: get(second, "telepon") || get(second, "phone") || "-",
          address: get(second, "address") || "-",
          npwp: get(second, "identity", "npwp") || "-",
          approval_status: data.second_client_approval || "pending",
          // File identitas
          file_ktp: get(second, "identity", "file_ktp") || null,
          file_kk: get(second, "identity", "file_kk") || null,
          file_npwp: get(second, "identity", "file_npwp") || null,
          file_photo: get(second, "identity", "file_photo") || null,
          file_sign: get(second, "identity", "file_sign") || null,
        }
      : null;

    return {
      kode: data.tracking_code,
      nama: data.name,
      jenis_akta: deed.name || "-",
      deskripsi: deed.description || "-",
      status_raw: data.status_approval,
      dibuat: data.created_at,
      draft_akta: data.draft_file || null,
      penghadap1Data,
      penghadap2Data,
      schedules: Array.isArray(data.schedules) ? data.schedules : [],
    };
  }, [data]);

  // Helper untuk render detail penghadap
  const renderPenghadapDetail = (penghadapData, title) => {
    const isApproved = penghadapData.approval_status === "approved";

    return (
      <div className="rounded-lg p-3 bg-base-200">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">{title}</div>
          <div>{renderStatusBadge(penghadapData.approval_status)}</div>
        </div>

        <div className="text-sm space-y-2">
          <div>
            <span className="opacity-70">Nama:</span>
            <span className="ml-2 font-medium">{penghadapData.name}</span>
          </div>
          <div>
            <span className="opacity-70">Email:</span>
            <span className="ml-2">{penghadapData.email}</span>
          </div>

          {/* Detail identitas hanya tampil jika approved */}
          {isApproved && (
            <>
              <div>
                <span className="opacity-70">NIK:</span>
                <span className="ml-2 font-mono">{penghadapData.nik}</span>
              </div>
              <div>
                <span className="opacity-70">NPWP:</span>
                <span className="ml-2 font-mono">{penghadapData.npwp}</span>
              </div>
              <div>
                <span className="opacity-70">Telepon:</span>
                <span className="ml-2">{penghadapData.telepon}</span>
              </div>
              <div>
                <span className="opacity-70">Alamat:</span>
                <span className="ml-2">{penghadapData.address}</span>
              </div>

              {/* File identitas */}
              <div className="border-t pt-2 mt-3">
                <div className="text-xs opacity-70 mb-2 font-medium">
                  Dokumen Identitas:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="opacity-70 text-xs">KTP:</span>
                    <div className="ml-1">
                      <IdentityFileLink
                        fileUrl={penghadapData.file_ktp}
                        label="Lihat KTP"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="opacity-70 text-xs">KK:</span>
                    <div className="ml-1">
                      <IdentityFileLink
                        fileUrl={penghadapData.file_kk}
                        label="Lihat KK"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="opacity-70 text-xs">NPWP:</span>
                    <div className="ml-1">
                      <IdentityFileLink
                        fileUrl={penghadapData.file_npwp}
                        label="Lihat NPWP"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="opacity-70 text-xs">Foto:</span>
                    <div className="ml-1">
                      <IdentityFileLink
                        fileUrl={penghadapData.file_photo}
                        label="Lihat Foto"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="opacity-70 text-xs">Tanda Tangan:</span>
                    <div className="ml-1">
                      <IdentityFileLink
                        fileUrl={penghadapData.file_sign}
                        label="Lihat TTD"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {!isApproved && (
            <div className="text-xs opacity-50 italic mt-2">
              Detail identitas akan ditampilkan setelah persetujuan
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!id) {
    return (
      <div className="p-6">
        <div className="alert alert-warning">ID aktivitas tidak valid.</div>
        <div className="flex justify-end mt-4">
          <button className="btn" onClick={closeModal}>
            Tutup
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-md" />
        <div className="text-sm opacity-70">Memuat detail…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">{error}</div>
        <div className="flex justify-end mt-4">
          <button className="btn" onClick={closeModal}>
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const hasSecondClient = !!view.penghadap2Data;

  return (
    <div className="space-y-5">
      {/* Header ringkas */}
      <div>
        <div className="text-xs opacity-70">Kode Aktivitas</div>
        <div className="font-semibold">{view.kode}</div>
      </div>

      {/* Info utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg p-3 bg-base-200 md:col-span-2">
          <div className="text-xs opacity-70 mb-1">Nama Aktivitas</div>
          <div className="font-medium text-lg">{view.nama}</div>
        </div>

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Jenis Akta</div>
          <div className="font-medium">{view.jenis_akta}</div>
        </div>

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Status Aktivitas</div>
          <div className="font-medium">
            {renderStatusBadge(view.status_raw)}
          </div>
        </div>

        {view.deskripsi && view.deskripsi !== "-" && (
          <div className="rounded-lg p-3 bg-base-200 md:col-span-2">
            <div className="text-xs opacity-70 mb-1">Deskripsi</div>
            <div className="font-medium text-sm">{view.deskripsi}</div>
          </div>
        )}

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Waktu Dibuat</div>
          <div className="font-medium">
            {moment(view.dibuat).format("DD MMM YYYY HH:mm")}
          </div>
        </div>

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Draft Akta</div>
          {view.draft_akta ? (
            <a
              href={view.draft_akta}
              target="_blank"
              rel="noreferrer"
              className="link link-primary"
            >
              Lihat
            </a>
          ) : (
            <span className="opacity-60">-</span>
          )}
        </div>
      </div>

      {/* Status Persetujuan Overview */}
      <div className="bg-base-200 rounded-lg p-4">
        <div className="font-semibold mb-3 text-lg">Status Persetujuan</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
            <div>
              <div className="font-medium">Penghadap 1</div>
              <div className="text-sm opacity-70">
                {view.penghadap1Data.name}
              </div>
            </div>
            <div>{renderStatusBadge(view.penghadap1Data.approval_status)}</div>
          </div>

          {hasSecondClient ? (
            <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
              <div>
                <div className="font-medium">Penghadap 2</div>
                <div className="text-sm opacity-70">
                  {view.penghadap2Data.name}
                </div>
              </div>
              <div>
                {renderStatusBadge(view.penghadap2Data.approval_status)}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg opacity-50">
              <div>
                <div className="font-medium">Penghadap 2</div>
                <div className="text-sm opacity-70">Tidak ada</div>
              </div>
              <div className="text-gray-400">-</div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Penghadap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Penghadap 1 */}
        {renderPenghadapDetail(view.penghadap1Data, "Penghadap 1")}

        {/* Penghadap 2 */}
        {hasSecondClient ? (
          renderPenghadapDetail(view.penghadap2Data, "Penghadap 2")
        ) : (
          <div className="rounded-lg p-3 bg-base-200 opacity-50">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Penghadap 2</div>
              <div className="text-gray-400">-</div>
            </div>
            <div className="text-sm">
              <div>
                <span className="opacity-70">Nama:</span>
                <span className="ml-2 font-medium">Tidak ada</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Jadwal (opsional) */}
      {view.schedules.length > 0 && (
        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-2">Jadwal</div>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            {view.schedules.map((s) => (
              <li key={s.id}>
                {moment(s.date).format("DD MMM YYYY")} • {s.time} •{" "}
                {s.location || "-"}
                {s.notes ? ` — ${s.notes}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button className="btn" onClick={closeModal}>
          Tutup
        </button>
      </div>
    </div>
  );
}
