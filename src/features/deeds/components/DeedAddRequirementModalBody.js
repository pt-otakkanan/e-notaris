// src/components/ModalBodies/DeedAddRequirementModalBody.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../components/Input/InputText";
import { showNotification } from "../../../features/common/headerSlice";
import RequirementService from "../../../services/requirement.service";
import { fetchDeeds } from "../../../features/deeds/deedSlice";

export default function DeedAddRequirementModalBody({
  extraObject = {},
  closeModal,
}) {
  const dispatch = useDispatch();
  const { lastQuery } = useSelector(
    (s) => s.deed || { lastQuery: { page: 1, per_page: 10, search: "" } }
  );

  // `extraObject` berisi row akta yg dipilih (minimal perlu id & nama/nama akta)
  const deedId = extraObject?.id;
  const deedName = extraObject?.nama || extraObject?.name || "-";

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    inputType: "text", // 'text' | 'file'  -> dikirim sebagai is_file boolean
  });

  const updateFormValue = ({ updateType, value }) =>
    setForm((prev) => ({ ...prev, [updateType]: value }));

  const validate = () => {
    if (!deedId) return "Akta tidak valid.";
    if (!form.name.trim()) return "Nama dokumen wajib diisi.";
    if (!["text", "file"].includes(form.inputType))
      return "Jenis input tidak valid.";
    return null;
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      dispatch(showNotification({ message: v, status: 0 }));
      return;
    }

    try {
      setSaving(true);
      await RequirementService.create({
        deed_id: deedId,
        name: form.name.trim(),
        is_file: form.inputType === "file",
      });

      dispatch(
        showNotification({
          message: "Dokumen tambahan berhasil ditambahkan",
          status: 1,
        })
      );

      // refresh daftar akta supaya badge "Dokumen Tambahan" ikut update
      await dispatch(fetchDeeds(lastQuery));

      closeModal();
    } catch (err) {
      const status = err?.response?.status;
      let msg = err?.response?.data?.message || "Gagal menambah dokumen.";

      // ambil pesan validasi pertama kalau 422
      const errors = err?.response?.data?.data || err?.response?.data?.errors;
      if (status === 422 && errors && typeof errors === "object") {
        const firstKey = Object.keys(errors)[0];
        const firstMsg = Array.isArray(errors[firstKey])
          ? errors[firstKey][0]
          : String(errors[firstKey]);
        if (firstMsg) msg = firstMsg;
      }
      dispatch(showNotification({ message: msg, status: 0 }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Info Akta */}
      <div className="rounded-lg p-3 bg-base-200">
        <div className="text-xs opacity-70 mb-1">Akta</div>
        <div className="font-medium">{deedName}</div>
      </div>

      {/* Nama dokumen */}
      <InputText
        type="text"
        labelTitle="Nama"
        labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
        value={form.name}
        updateFormValue={updateFormValue}
        updateType="name"
        placeholder="Contoh: Surat Kuasa Penghadap 1"
      />

      {/* Pilihan jenis input (radio only) */}
      <div>
        <label className="label p-0 mb-1">
          <span className="label-text">Jenis Input</span>
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="inputType"
              className="radio radio-sm"
              checked={form.inputType === "text"}
              onChange={() =>
                updateFormValue({ updateType: "inputType", value: "text" })
              }
            />
            <span>Teks</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="inputType"
              className="radio radio-sm"
              checked={form.inputType === "file"}
              onChange={() =>
                updateFormValue({ updateType: "inputType", value: "file" })
              }
            />
            <span>File</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button className="btn" onClick={closeModal} disabled={saving}>
          Tutup
        </button>
        <button
          className={`btn bg-[#0256c4] text-white ${saving ? "loading" : ""}`}
          onClick={handleSave}
          disabled={saving}
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
