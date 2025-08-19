import { useState } from "react";
import InputText from "../../../components/Input/InputText";

export default function DeedAddRequirementModalBody({
  extraObject = {},
  closeModal,
}) {
  const [form, setForm] = useState({
    name: "",
    inputType: "text", // 'text' | 'file'
  });

  const updateFormValue = ({ updateType, value }) =>
    setForm((prev) => ({ ...prev, [updateType]: value }));

  const handleSave = () => {
    const payload = {
      name: form.name,
      type: form.inputType,
    };
    console.log("submit:", payload);
    closeModal();
  };

  return (
    <div className="space-y-4">
      {/* Nama dokumen */}
      <InputText
        type="text"
        labelTitle="Nama"
        labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
        defaultValue={form.name}
        updateFormValue={updateFormValue}
        updateType="name"
        placeholder="Contoh: KTP Penghadap 1"
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

        {/* Optional: kirim juga ke form tradisional */}
        <input type="hidden" name="input_type" value={form.inputType} />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button className="btn" onClick={closeModal}>
          Tutup
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Simpan
        </button>
      </div>
    </div>
  );
}
