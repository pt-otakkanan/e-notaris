// src/components/ModalBodies/DeedDetailModalBody.jsx
import { useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../features/common/headerSlice";
import RequirementService from "../../../services/requirement.service";

export default function DeedDetailModalBody({ extraObject = {}, closeModal }) {
  const dispatch = useDispatch();

  const {
    id,
    nama,
    deskripsi,
    jumlah_penghadap,
    dokumen_tambahan = [],
    created_at,
    // optional: callback untuk beri tahu parent agar refetch
    onChanged,
  } = extraObject || {};

  // lokal state agar list bisa diupdate setelah hapus
  const [requirements, setRequirements] = useState(dokumen_tambahan);
  const [confirmId, setConfirmId] = useState(null); // id requirement yg sedang dikonfirmasi
  const [deletingId, setDeletingId] = useState(null); // spinner per item

  const askConfirm = (req) => setConfirmId(req?.id ?? null);
  const cancelConfirm = () => setConfirmId(null);

  const deleteRequirement = async (req) => {
    if (!req?.id) {
      dispatch(
        showNotification({
          message: "ID data tambahan tidak ditemukan.",
          status: 0,
        })
      );
      return;
    }
    try {
      setDeletingId(req.id);
      await RequirementService.remove(req.id);
      setRequirements((prev) => prev.filter((r) => r.id !== req.id));
      setConfirmId(null);
      dispatch(
        showNotification({
          message: "Data tambahan berhasil dihapus",
          status: 1,
        })
      );
      // beri tahu parent (opsional)
      if (typeof onChanged === "function") {
        onChanged({
          type: "requirement-removed",
          deedId: id,
          requirementId: req.id,
        });
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message || "Gagal menghapus data tambahan.";
      dispatch(showNotification({ message: msg, status: 0 }));
    } finally {
      setDeletingId(null);
    }
  };

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

        {requirements.length === 0 ? (
          <div className="opacity-60">Tidak ada dokumen.</div>
        ) : (
          <ul className="space-y-2">
            {requirements.map((d) => (
              <li
                key={d.id ?? d.name}
                className="flex items-center justify-between gap-3"
              >
                <span className="font-medium">{d.name}</span>

                {confirmId === d.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-70">Yakin?</span>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={cancelConfirm}
                      disabled={deletingId === d.id}
                    >
                      Batal
                    </button>
                    <button
                      className={`btn btn-error btn-xs ${
                        deletingId === d.id ? "loading" : ""
                      }`}
                      onClick={() => deleteRequirement(d)}
                      disabled={deletingId === d.id}
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-ghost btn-xs text-red-600 hover:text-red-800"
                    onClick={() => askConfirm(d)}
                    disabled={!d.id}
                    title={!d.id ? "Data dummy tidak dapat dihapus" : "Hapus"}
                  >
                    Hapus
                  </button>
                )}
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
