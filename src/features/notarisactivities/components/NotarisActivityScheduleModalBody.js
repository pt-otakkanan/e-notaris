// Perbaikan untuk NotarisActivityScheduleModalBody
import { useState, useEffect } from "react";
import moment from "moment";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import InputText from "../../../components/Input/InputText";

export default function NotarisActivityScheduleModalBody({
  extraObject = {},
  closeModal,
}) {
  const {
    activity = {},
    existingSchedule = null,
    onSubmit,
  } = extraObject || {};

  const [form, setForm] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });
  const [error, setError] = useState("");

  // Prefill dari existingSchedule dan activity data
  useEffect(() => {
    if (existingSchedule) {
      const schedule = moment(existingSchedule);
      setForm({
        date: schedule.format("YYYY-MM-DD"),
        time: schedule.format("HH:mm"),
        location: activity.schedule_location || "", // Ambil dari field yang benar
        notes: activity.schedule_notes || "",
      });
    } else {
      // Jika tidak ada schedule, tapi mungkin ada data lokasi/notes dari activity
      setForm({
        date: "",
        time: "",
        location: activity.schedule_location || "",
        notes: activity.schedule_notes || "",
      });
    }
  }, [existingSchedule, activity]);

  const updateFormValue = ({ updateType, value }) => {
    setForm((prev) => ({ ...prev, [updateType]: value }));
  };

  // Batas tanggal
  const minDate = moment().format("YYYY-MM-DD");
  const maxDate = moment().add(3, "months").format("YYYY-MM-DD");

  const validateForm = () => {
    if (!form.date) {
      setError("Tanggal harus dipilih.");
      return false;
    }
    if (!form.time) {
      setError("Waktu harus dipilih.");
      return false;
    }
    if (!form.location?.trim()) {
      setError("Lokasi wajib diisi.");
      return false;
    }

    const selected = moment(`${form.date} ${form.time}`, "YYYY-MM-DD HH:mm");
    if (selected.isBefore(moment())) {
      setError("Tidak dapat menjadwalkan di waktu yang sudah lewat.");
      return false;
    }
    const dow = moment(form.date).day();
    if (dow === 0 || dow === 6) {
      setError("Penjadwalan hanya tersedia pada hari kerja (Senin–Jumat).");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    console.log("Submitting schedule:", form);
    const scheduleData = {
      activityId: activity.id,
      scheduledDate: form.date,
      scheduledTime: form.time,
      location: form.location.trim(),
      notes: form.notes?.trim() || "",
      isUpdate: !!existingSchedule, // Flag untuk menentukan update/create
    };

    setError("");
    onSubmit?.(scheduleData);
    closeModal();
  };

  const handleClearSchedule = () => {
    if (window.confirm("Yakin ingin menghapus jadwal ini?")) {
      const clearData = {
        activityId: activity.id,
        isDelete: true,
      };
      onSubmit?.(clearData);
      closeModal();
    }
  };

  return (
    <div className="space-y-5">
      {/* Info Aktivitas */}
      <div className="bg-base-200 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Detail Aktivitas</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Kode:</span>
            <span className="ml-2 font-mono">{activity.kode}</span>
          </div>
          <div>
            <span className="text-gray-600">Jenis Akta:</span>
            <span className="ml-2">{activity.jenis_akta}</span>
          </div>
          <div>
            <span className="text-gray-600">Penghadap 1:</span>
            <span className="ml-2">{activity.penghadap1}</span>
          </div>
          <div>
            <span className="text-gray-600">Penghadap 2:</span>
            <span className="ml-2">{activity.penghadap2 || "-"}</span>
          </div>
        </div>
      </div>

      {/* Form Penjadwalan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Tanggal <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={form.date}
            min={minDate}
            max={maxDate}
            onChange={(e) =>
              updateFormValue({ updateType: "date", value: e.target.value })
            }
          />
          <label className="label">
            <span className="label-text-alt text-gray-500">
              Hanya hari kerja (Senin–Jumat)
            </span>
          </label>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Waktu <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="time"
            className="input input-bordered"
            value={form.time}
            onChange={(e) =>
              updateFormValue({ updateType: "time", value: e.target.value })
            }
            disabled={!form.date}
            step="900"
          />
          <label className="label">
            <span className="label-text-alt text-gray-500">
              Contoh: 09:00, 13:30, 16:00
            </span>
          </label>
        </div>
      </div>

      <InputText
        labelTitle="Lokasi Pertemuan"
        containerStyle="mt-4"
        value={form.location}
        updateFormValue={updateFormValue}
        updateType="location"
        placeholder="Kantor notaris, rumah klien, dll."
        isRequired={true}
      />

      <TextAreaInput
        labelTitle="Catatan Tambahan"
        containerStyle="mt-4"
        value={form.notes} // dikontrol dari parent
        updateFormValue={updateFormValue}
        updateType="notes"
        placeholder="Dokumen yang perlu disiapkan, catatan khusus, dll."
      />

      {error && (
        <div className="alert alert-error my-2 py-2 text-sm relative">
          {error}
          <button
            type="button"
            className="absolute right-2 top-1 font-bold"
            onClick={() => setError("")}
            aria-label="Tutup alert"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <div>
          {existingSchedule && (
            <button
              className="btn btn-error btn-outline"
              onClick={handleClearSchedule}
            >
              Hapus Jadwal
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button className="btn" onClick={closeModal}>
            Batal
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!form.date || !form.time || !form.location?.trim()}
          >
            {existingSchedule ? "Perbarui Jadwal" : "Simpan Jadwal"}
          </button>
        </div>
      </div>
    </div>
  );
}
