// src/components/ModalBodies/DeedAddModalBody.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import { showNotification } from "../../../features/common/headerSlice";
import DeedService from "../../../services/deed.service";
import { fetchDeeds } from "../../../features/deeds/deedSlice"; // ⬅️ penting

export default function DeedAddModalBody({ extraObject = {}, closeModal }) {
  const dispatch = useDispatch();
  const { lastQuery } = useSelector(
    (s) => s.deed || { lastQuery: { page: 1, per_page: 10, search: "" } }
  );
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    jumlah_penghadap: "1",
  });

  const updateFormValue = ({ updateType, value }) =>
    setForm((p) => ({ ...p, [updateType]: value }));

  const validate = () => {
    if (!form.name.trim()) return "Nama dokumen wajib diisi.";
    if (!form.description.trim()) return "Deskripsi wajib diisi.";
    const jp = Number(form.jumlah_penghadap);
    if (![1, 2].includes(jp)) return "Jumlah penghadap harus 1 atau 2.";
    return null;
  };

  const onSubmit = async () => {
    const v = validate();
    if (v) return dispatch(showNotification({ message: v, status: 0 }));

    try {
      setSaving(true);
      await DeedService.create({
        name: form.name.trim(),
        description: form.description.trim(),
        is_double_client: Number(form.jumlah_penghadap) === 2,
      });

      // ⬇️ refresh daftar pakai query terakhir
      await dispatch(fetchDeeds(lastQuery));

      dispatch(
        showNotification({ message: "Akta berhasil dibuat", status: 1 })
      );
      closeModal();
    } catch (err) {
      const status = err?.response?.status;
      let msg = err?.response?.data?.message || "Gagal membuat akta.";
      const errors = err?.response?.data?.data || err?.response?.data?.errors;
      if (status === 422 && errors && typeof errors === "object") {
        const k = Object.keys(errors)[0];
        const first = Array.isArray(errors[k])
          ? errors[k][0]
          : String(errors[k]);
        if (first) msg = first;
      }
      dispatch(showNotification({ message: msg, status: 0 }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <InputText
          labelTitle="Nama Lengkap"
          value={form.name} // ⬅️ controlled
          updateFormValue={updateFormValue}
          updateType="name"
          placeholder="Contoh : Pendirian PT"
        />

        <TextAreaInput
          labelTitle="Deskripsi"
          value={form.description} // ⬅️ controlled (jangan defaultValue)
          updateFormValue={updateFormValue}
          updateType="description"
          placeholder="Deskripsi singkat akta…"
        />

        <div>
          <label className="label">
            <span className="label-text after:content-['*'] after:ml-1 after:text-red-500">
              Jumlah Penghadap
            </span>
          </label>
          <div className="join w-full">
            <select
              className="select select-bordered join-item w-full"
              value={form.jumlah_penghadap}
              onChange={(e) =>
                updateFormValue({
                  updateType: "jumlah_penghadap",
                  value: e.target.value,
                })
              }
            >
              <option value="1">1 Penghadap</option>
              <option value="2">2 Penghadap</option>
            </select>
          </div>
          {/* <div className="text-xs opacity-70 mt-1">
            Nilai ini akan dikirim sebagai{" "}
            <span className="font-mono">is_double_client</span> ke server.
          </div> */}
        </div>
      </div>

      <div className="flex justify-end pt-2 gap-2">
        <button
          className="btn btn-outline"
          onClick={closeModal}
          disabled={saving}
        >
          Tutup
        </button>
        <button
          className={`btn hover:text-black text-white bg-[#96696d] w-36 ${
            saving ? "loading" : ""
          }`}
          onClick={onSubmit}
          disabled={saving}
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
