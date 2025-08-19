import { useMemo, useState } from "react";
import InputSelect from "../../../components/Input/InputSelect";
import TextAreaInput from "../../../components/Input/TextAreaInput";

export default function NotarisActivityAddModalBody({
  extraObject = {},
  closeModal,
}) {
  const {
    jenisAkta,
    penghadap1Id,
    penghadap2Id,
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
    onSubmit,
  } = extraObject || {};

  const [form, setForm] = useState({
    jenisAkta: jenisAkta || "",
    penghadap1Id: penghadap1Id || "",
    penghadap2Id: penghadap2Id || "",
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
    if (!form.jenisAkta || !form.penghadap1Id || !form.penghadap2Id) {
      setError("Semua field wajib diisi.");
      return;
    }
    setError("");
    if (typeof onSubmit === "function") onSubmit(form);
    closeModal();
  };

  return (
    <div className="space-y-5">
      <InputSelect
        labelTitle="Jenis Akta"
        required
        options={jenisAktaOptions}
        defaultValue={form.jenisAkta}
        updateType="jenisAkta"
        updateFormValue={updateFormValue}
        placeholder="Pilih jenis akta…"
      />

      <InputSelect
        labelTitle="Penghadap 1"
        required
        options={peopleOptions}
        defaultValue={form.penghadap1Id}
        updateType="penghadap1Id"
        updateFormValue={updateFormValue}
        placeholder="Pilih penghadap 1…"
      />

      <InputSelect
        labelTitle="Penghadap 2"
        required
        options={peopleP2Options}
        defaultValue={form.penghadap2Id}
        updateType="penghadap2Id"
        updateFormValue={updateFormValue}
        placeholder={
          form.penghadap1Id ? "Pilih penghadap 2…" : "Pilih Penghadap 1 dulu"
        }
        disabled={!form.penghadap1Id}
      />

      <TextAreaInput
        labelTitle="Deskripsi"
        defaultValue=""
        updateFormValue=""
      />

      {error ? (
        <div className="alert alert-warning my-2 py-2 text-sm">{error}</div>
      ) : null}

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
