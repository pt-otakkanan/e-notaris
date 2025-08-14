import moment from "moment";

export default function NotarisActivityDetailModalBody({
  extraObject = {},
  closeModal,
}) {
  const {
    kode,
    jenis_akta,
    penghadap1,
    penghadap2,
    status,
    draft_akta,
    waktu,

    penghadap1_email,
    penghadap2_email,
    penghadap1_nik,
    penghadap2_nik,
    penghadap1_ktp,
    penghadap2_ktp,
    penghadap1_phone,
    penghadap2_phone,
    penghadap1_address,
    penghadap2_address,
  } = extraObject || {};

  const renderStatusBadge = (s) => {
    const m = {
      Draft:
        "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
      Menunggu:
        "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
      Selesai:
        "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
      Ditolak: "badge-error",
    };
    const cls = "badge " + (m[s] || "badge-ghost");
    return <span className={cls}>{s || "-"}</span>;
  };

  return (
    <div className="space-y-5">
      {/* Header ringkas */}
      <div>
        <div className="text-xs opacity-70">Kode</div>
        <div className="font-semibold">{kode || "-"}</div>
      </div>

      {/* Info utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Jenis Akta</div>
          <div className="font-medium">{jenis_akta || "-"}</div>
        </div>
        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Status</div>
          <div className="font-medium">{renderStatusBadge(status)}</div>
        </div>
        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Waktu</div>
          <div className="font-medium">
            {moment(waktu || new Date()).format("DD MMM YYYY HH:mm")}
          </div>
        </div>
        <div className="rounded-lg p-3 bg-base-200">
          <div className="text-xs opacity-70 mb-1">Draft Akta</div>
          {draft_akta ? (
            <a
              href={draft_akta}
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

      {/* Penghadap 1 & 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Penghadap 1 */}
        <div className="rounded-lg p-3 bg-base-200">
          <div className="font-semibold mb-2">Penghadap 1</div>
          <div className="text-sm">
            <span className="opacity-70">Nama:</span> {penghadap1 || "-"}
          </div>
          <div className="text-sm">
            <span className="opacity-70">Email:</span> {penghadap1_email || "-"}
          </div>
          <div className="text-sm">
            <span className="opacity-70">NIK:</span>{" "}
            <span className="font-mono">{penghadap1_nik || "-"}</span>
          </div>
          <div className="text-sm">
            <span className="opacity-70">Telepon:</span>{" "}
            {penghadap1_phone || "-"}
          </div>
          <div className="text-sm">
            <span className="opacity-70">Alamat:</span>{" "}
            {penghadap1_address || "-"}
          </div>
          <div className="text-sm">
            <span className="opacity-70">File KTP:</span>{" "}
            {penghadap1_ktp ? (
              <a
                href={penghadap1_ktp}
                target="_blank"
                rel="noreferrer"
                className="link link-primary"
              >
                Lihat
              </a>
            ) : (
              "-"
            )}
          </div>
        </div>

        {/* Penghadap 2 */}
        <div className="rounded-lg p-3 bg-base-200">
          <div className="font-semibold mb-2">Penghadap 2</div>
          <div className="text-sm">
            <span className="opacity-70">Nama:</span> {penghadap2 || "-"}
          </div>
          <div className="text-sm">
            <span className="opacity-70">Email:</span> {penghadap2_email || "-"}
          </div>
          <div className="text-sm">
            <span className="opacity-70">NIK:</span>{" "}
            <span className="font-mono">{penghadap2_nik || "-"}</span>
          </div>
          <div className="text-sm">
            <span className="opacity-70">Telepon:</span>{" "}
            {penghadap2_phone || "-"}
          </div>
          <div className="text-sm">
            <span className="opacity-70">Alamat:</span>{" "}
            {penghadap2_address || "-"}
          </div>
          <div className="text-sm">
            <span className="opacity-70">File KTP:</span>{" "}
            {penghadap2_ktp ? (
              <a
                href={penghadap2_ktp}
                target="_blank"
                rel="noreferrer"
                className="link link-primary"
              >
                Lihat
              </a>
            ) : (
              "-"
            )}
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
