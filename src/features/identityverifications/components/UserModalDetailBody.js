import moment from "moment";

export default function UserDetailModalBody({ extraObject = {}, closeModal }) {
  const {
    id,
    first_name,
    last_name,
    email,
    avatar,
    gender,
    role,
    joined_at,
    address,
    verification_status,
  } = extraObject || {};

  const renderStatusBadge = (status) => {
    let cls = "badge ";
    if (status === "Disetujui") cls += "badge-success";
    else if (status === "Menunggu") cls += "badge-warning";
    else if (status === "Ditolak") cls += "badge-error";
    else cls += "badge-ghost";
    return <span className={cls}>{status || "Tidak diketahui"}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-lg">
            {first_name} {last_name}
          </h2>
          <p className="text-sm opacity-70">{email}</p>
          {id ? <p className="text-xs opacity-60">ID: {id}</p> : null}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Jenis Kelamin</div>
          <div className="font-medium">{gender || "Tidak diketahui"}</div>
        </div>

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Role</div>
          <div className="font-medium">{role || "User"}</div>
        </div>

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Status Verifikasi</div>
          <div className="font-medium">
            {renderStatusBadge(verification_status)}
          </div>
        </div>

        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Bergabung Sejak</div>
          <div className="font-medium">
            {moment(joined_at || new Date()).format("DD MMM YYYY")}
          </div>
        </div>

        <div className="rounded-lg p-3 bg-base-200 md:col-span-2">
          <div className="text-xs opacity-70 mb-1">Alamat</div>
          <div className="font-medium">{address || "-"}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button className="btn" onClick={closeModal}>
          Tutup
        </button>
      </div>
    </div>
  );
}
