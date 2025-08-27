import { useState } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import FileInput from "../../components/Input/InputFile";
import { showNotification } from "../common/headerSlice";
import { useDispatch } from "react-redux";

function NotarisRequirements() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("penghadap1");

  // State untuk semua file dokumen per penghadap
  const [form, setForm] = useState({
    penghadap1: {
      ktp: { file: null, previewUrl: "" },
      npwp: { file: null, previewUrl: "" },
      nib: { file: null, previewUrl: "" },
      tdp: { file: null, previewUrl: "" },
    },
    penghadap2: {
      ktp: { file: null, previewUrl: "" },
      npwp: { file: null, previewUrl: "" },
      nib: { file: null, previewUrl: "" },
      tdp: { file: null, previewUrl: "" },
    },
  });

  const updateFormValue = ({ updateType, value }) => {
    setForm((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [updateType]: value },
    }));
  };

  const updateDokumen = () => {
    const current = form[activeTab];

    if (!current.ktp.file) {
      dispatch(
        showNotification({
          message: `File KTP ${activeTab} wajib diupload`,
          status: 0,
        })
      );
      return;
    }

    if (!current.npwp.file) {
      dispatch(
        showNotification({
          message: `File NPWP ${activeTab} wajib diupload`,
          status: 0,
        })
      );
      return;
    }

    console.log(`Dokumen ${activeTab}:`, current);
    dispatch(
      showNotification({
        message: `Dokumen ${activeTab} berhasil diupdate`,
        status: 1,
      })
    );
  };

  const renderForm = (data) => (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 dark:text-[#ecfffd] mb-6">
        Upload dokumen-dokumen berikut untuk melengkapi verifikasi akun Anda.
        File yang diperbolehkan: PDF, JPG, JPEG, PNG (maksimal 5MB per file)
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileInput
          labelTitle="File KTP"
          labelStyle="dark:text-[#ecfffd]"
          accept=".pdf,.jpg,.jpeg,.png"
          required
          maxSizeMB={2}
          updateType="ktp"
          updateFormValue={updateFormValue}
          defaultPreviewUrl={data.ktp.previewUrl}
        />
        <FileInput
          labelTitle="File NPWP"
          labelStyle="dark:text-[#ecfffd]"
          accept=".pdf,.jpg,.jpeg,.png"
          required
          maxSizeMB={2}
          updateType="npwp"
          updateFormValue={updateFormValue}
          defaultPreviewUrl={data.npwp.previewUrl}
        />
        <FileInput
          labelTitle="File NIB (Nomor Induk Berusaha)"
          labelStyle="dark:text-[#ecfffd]"
          accept=".pdf,.jpg,.jpeg,.png"
          updateType="nib"
          maxSizeMB={2}
          updateFormValue={updateFormValue}
          defaultPreviewUrl={data.nib.previewUrl}
        />
        <FileInput
          labelTitle="File TDP (Tanda Daftar Perusahaan)"
          labelStyle="dark:text-[#ecfffd]"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSizeMB={2}
          updateType="tdp"
          updateFormValue={updateFormValue}
          defaultPreviewUrl={data.tdp.previewUrl}
        />
      </div>
    </div>
  );

  return (
    <TitleCard title="Dokumen Tambahan Pendirian PT Otak Kiri" topMargin="mt-2">
      {/* Tabs */}
      <div className="tabs mb-6">
        <div
          className={`tab tab-bordered transition-all duration-200 cursor-pointer ${
            activeTab === "penghadap1"
              ? "tab-active text-white bg-[#0256c4] dark:bg-[#7b9cc9] dark:text-primary-content"
              : "bg-base-200 hover:bg-base-300 text-base-content dark:bg-[#01043c]"
          }`}
          onClick={() => setActiveTab("penghadap1")}
        >
          Penghadap 1
        </div>
        <div
          className={`tab tab-bordered transition-all duration-200 cursor-pointer ${
            activeTab === "penghadap2"
              ? "tab-active text-white bg-[#0256c4] dark:bg-[#7b9cc9] dark:text-primary-content"
              : "bg-base-200 hover:bg-base-300 text-base-content dark:bg-[#01043c]"
          }`}
          onClick={() => setActiveTab("penghadap2")}
        >
          Penghadap 2
        </div>
      </div>

      {/* Content */}
      {activeTab === "penghadap1" && renderForm(form.penghadap1)}
      {activeTab === "penghadap2" && renderForm(form.penghadap2)}

      <div className="mt-8">
        <button
          className="btn bg-[#0256c4] text-white hover:text-[#01043c] dark:bg-[#7b9cc9] dark:text-[#01043c] dark:hover:bg-gray-400 dark:hover:text-white float-right"
          onClick={updateDokumen}
        >
          Simpan Dokumen{" "}
          {activeTab === "penghadap1" ? "Penghadap 1" : "Penghadap 2"}
        </button>
      </div>
    </TitleCard>
  );
}

export default NotarisRequirements;
