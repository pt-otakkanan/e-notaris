// src/components/ModalBodies/UserDetailModalBody.jsx
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import UserService from "../../../services/user.service";

const mapGender = (g) => {
  if (!g) return "-";
  const s = String(g).toLowerCase();
  if (s === "male") return "Laki-laki";
  if (s === "female") return "Perempuan";
  if (s === "lainnya") return "Lainnya";
  return "-";
};

const statusLabel = (s) => {
  const k = String(s || "").toLowerCase();
  if (k === "approved") return "Disetujui";
  if (k === "pending") return "Menunggu";
  if (k === "rejected") return "Ditolak";
  return "Tidak diketahui";
};

const StatusBadge = ({ value }) => {
  const label = statusLabel(value);
  const cls =
    {
      Disetujui:
        "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
      Menunggu:
        "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
      Ditolak:
        "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
      "Tidak diketahui":
        "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 inset-ring inset-ring-gray-400/20",
    }[label] || "badge-ghost";
  return <span className={`badge ${cls}`}>{label}</span>;
};

export default function UserDetailModalBody({ extraObject = {}, closeModal }) {
  // extraObject boleh berupa id atau object user
  const idFromExtra =
    typeof extraObject === "number" ? extraObject : extraObject?.id ?? null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!idFromExtra);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!idFromExtra) return;
      try {
        setLoading(true);
        const res = await UserService.getAdminUserDetail(idFromExtra);
        const d = res?.data || {};

        // status & notes: utamakan dari identity
        const statusRaw =
          (d.identity?.verification_status ?? d.status_verification ?? "") + "";

        const notes =
          d.identity?.verification_notes ?? d.notes_verification ?? "";

        if (!mounted) return;
        setData({
          id: d.id,
          name: d.name,
          email: d.email,
          telepon: d.telepon || "-",
          gender: mapGender(d.gender),
          address: d.address || "-",
          role: d.roles?.name || "-", // BE: roles { id, name }
          status_raw: statusRaw.toLowerCase(),
          status_label: statusLabel(statusRaw),
          notes_verification: notes,
          created_at: d.created_at,
          // avatar prioritas: identity.file_photo -> user.file_avatar -> fallback ui-avatars (di memo)
          avatar: d.identity?.file_photo || d.file_avatar || null,
          identity: d.identity || null,
        });
        setError("");
      } catch (e) {
        if (!mounted) return;
        setError("Gagal memuat detail pengguna.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [idFromExtra]);

  const avatarSrc = useMemo(() => {
    if (data?.avatar) return data.avatar;
    const nm = encodeURIComponent(data?.name || "U");
    return `https://ui-avatars.com/api/?name=${nm}`;
  }, [data]);

  if (loading) return <div className="p-6 text-center">Memuat detail…</div>;

  if (error)
    return (
      <div className="p-6 text-center text-error">
        {error}
        <div className="mt-4">
          <button className="btn" onClick={closeModal}>
            Tutup
          </button>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="p-6 text-center opacity-70">
        Data tidak tersedia.
        <div className="mt-4">
          <button className="btn" onClick={closeModal}>
            Tutup
          </button>
        </div>
      </div>
    );

  const iden = data.identity || {};
  const isRejected = String(data.status_raw).toLowerCase() === "rejected";

  const fileLink = (url) =>
    url ? (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="link link-primary break-all"
      >
        Klik untuk lihat
      </a>
    ) : (
      <span className="opacity-60">-</span>
    );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src={avatarSrc}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-lg">{data.name || "-"}</h2>
          <p className="text-sm opacity-70">{data.email || "-"}</p>
          <div className="text-xs opacity-60">ID: {data.id}</div>
        </div>
      </div>

      <div className="rounded-lg p-3 bg-base-200">
        <div className="text-xs opacity-70 mb-1">Status Verifikasi</div>
        <div className="font-medium">
          <StatusBadge value={data.status_raw} />
        </div>
      </div>
      {/* Catatan penolakan muncul hanya saat rejected */}
      {isRejected && (
        <div className="rounded-lg p-3 bg-red-50 border border-red-200 md:col-span-2">
          <div className="text-xs opacity-70 mb-1 text-red-700">
            Catatan Penolakan
          </div>
          <div className="font-medium text-red-700">
            {data.notes_verification || "-"}
          </div>
        </div>
      )}

      {/* User info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Telepon</div>
          <div className="font-medium">{data.telepon}</div>
        </div>

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Jenis Kelamin</div>
          <div className="font-medium">{data.gender}</div>
        </div>

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Role</div>
          <div className="font-medium">{data.role}</div>
        </div>

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Bergabung Sejak</div>
          <div className="font-medium">
            {moment(data.created_at || new Date()).format("DD MMM YYYY")}
          </div>
        </div>

        <div className="rounded-lg p-3 bg-base-200 md:col-span-2">
          <div className="text-xs opacity-70 mb-1">Alamat</div>
          <div className="font-medium">{data.address}</div>
        </div>
      </div>

      {/* Identity (lengkap + link file) */}
      <div>
        <div className="font-semibold mb-2">Identitas</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg p-3 bg-base-200">
            <div className="text-xs opacity-70 mb-1">NIK</div>
            <div className="font-medium">{iden.ktp || "-"}</div>
          </div>

          <div className="rounded-lg p-3 bg-base-200">
            <div className="text-xs opacity-70 mb-1">NPWP</div>
            <div className="font-medium">{iden.npwp || "-"}</div>
          </div>

          <div className="rounded-lg p-3 bg-base-200">
            <div className="text-xs opacity-70 mb-1">KTP Notaris</div>
            <div className="font-medium">{iden.ktp_notaris || "-"}</div>
          </div>

          <div className="rounded-lg p-3 bg-base-200">
            <div className="text-xs opacity-70 mb-1">File KTP</div>
            <div className="font-medium">{fileLink(iden.file_ktp)}</div>
          </div>

          <div className="rounded-lg p-3 bg-base-200">
            <div className="text-xs opacity-70 mb-1">File KK</div>
            <div className="font-medium">{fileLink(iden.file_kk)}</div>
          </div>

          <div className="rounded-lg p-3 bg-base-200">
            <div className="text-xs opacity-70 mb-1">File NPWP</div>
            <div className="font-medium">{fileLink(iden.file_npwp)}</div>
          </div>

          <div className="rounded-lg p-3 bg-base-200">
            <div className="text-xs opacity-70 mb-1">File KTP Notaris</div>
            <div className="font-medium">{fileLink(iden.file_ktp_notaris)}</div>
          </div>

          <div className="rounded-lg p-3 bg-base-200">
            <div className="text-xs opacity-70 mb-1">File Tanda Tangan</div>
            <div className="font-medium">{fileLink(iden.file_sign)}</div>
          </div>

          <div className="rounded-lg p-3 bg-base-200">
            <div className="text-xs opacity-70 mb-1">Foto Formal</div>
            <div className="font-medium">{fileLink(iden.file_photo)}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button className="btn" onClick={closeModal}>
          Tutup
        </button>
      </div>
    </div>
  );
}
