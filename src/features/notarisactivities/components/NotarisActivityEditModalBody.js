import { useMemo, useState } from "react";
import InputSelect from "../../../components/Input/InputSelect";
import TextAreaInput from "../../../components/Input/TextAreaInput";

export default function NotarisActivityEditModalBody({
  extraObject = {},
  closeModal,
}) {
  const {
    kode,
    jenis_akta,
    deskripsi,
    penghadap1Id,
    penghadap2Id,
    status,
    jenisAktaOptions = [
      { value: "akta-jual-beli", label: "Akta Jual Beli" },
      { value: "akta-hibah", label: "Akta Hibah" },
      { value: "akta-perjanjian", label: "Akta Perjanjian" },
      { value: "akta-pendirian", label: "Akta Pendirian" },
    ],
    peopleOptions = [
      { value: "1", label: "Budi Santoso" },
      { value: "2", label: "Siti Aisyah" },
      { value: "3", label: "Andi Wijaya" },
      { value: "4", label: "Dewi Putri" },
    ],
    statusOptions = [
      { value: "Draft", label: "Draft" },
      { value: "Menunggu", label: "Menunggu" },
      { value: "Selesai", label: "Selesai" },
      { value: "Ditolak", label: "Ditolak" },
    ],
    onSubmit,
  } = extraObject || {};

  const [form, setForm] = useState({
    jenis_akta: jenis_akta || "",
    deskripsi: deskripsi || "",
    penghadap1Id: penghadap1Id || "",
    penghadap2Id: penghadap2Id || "",
    status: status || "Draft",
  });
  const [error, setError] = useState("");

  const updateFormValue = ({ updateType, value }) => {
    setForm((prev) => {
      // kalau user ganti penghadap1 dan kebetulan sama dgn penghadap2 → reset penghadap2
      if (
        updateType === "penghadap1Id" &&
        String(value) === String(prev.penghadap2Id)
      ) {
        return { ...prev, penghadap1Id: value, penghadap2Id: "" };
      }
      return { ...prev, [updateType]: value };
    });
  };

  // opsi Penghadap 2 tidak boleh sama dg Penghadap 1
  const peopleP2Options = useMemo(
    () =>
      peopleOptions.filter(
        (p) => String(p.value) !== String(form.penghadap1Id)
      ),
    [peopleOptions, form.penghadap1Id]
  );

  const handleSave = () => {
    if (!form.jenis_akta || !form.penghadap1Id || !form.penghadap2Id) {
      setError("Jenis Akta, Penghadap 1, dan Penghadap 2 wajib diisi.");
      return;
    }
    setError("");
    if (typeof onSubmit === "function") onSubmit(form);
    closeModal();
  };

  return (
    <div className="space-y-5">
      {/* Header dengan Kode */}
      {kode && (
        <div className="bg-base-200 rounded-lg p-3">
          <div className="text-xs opacity-70">Kode Akta</div>
          <div className="font-semibold">{kode}</div>
        </div>
      )}

      <InputSelect
        labelTitle="Jenis Akta"
        labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
        options={jenisAktaOptions}
        defaultValue={form.jenis_akta}
        updateType="jenis_akta"
        updateFormValue={updateFormValue}
        placeholder="Pilih jenis akta…"
      />

      <TextAreaInput
        labelTitle="Deskripsi"
        defaultValue={form.deskripsi}
        updateType="deskripsi"
        updateFormValue={updateFormValue}
        placeholder="Masukkan deskripsi akta..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputSelect
          labelTitle="Penghadap 1"
          labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
          options={peopleOptions}
          defaultValue={form.penghadap1Id}
          updateType="penghadap1Id"
          updateFormValue={updateFormValue}
          placeholder="Pilih penghadap 1…"
        />

        <InputSelect
          labelTitle="Penghadap 2"
          labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
          options={peopleP2Options}
          defaultValue={form.penghadap2Id}
          updateType="penghadap2Id"
          updateFormValue={updateFormValue}
          placeholder={
            form.penghadap1Id ? "Pilih penghadap 2…" : "Pilih Penghadap 1 dulu"
          }
          disabled={!form.penghadap1Id}
        />
      </div>

      {error ? (
        <div className="alert alert-warning my-2 py-2 text-sm">{error}</div>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <button className="btn" onClick={closeModal}>
          Tutup
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
