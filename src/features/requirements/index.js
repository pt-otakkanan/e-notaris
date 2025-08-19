import { useState } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import FileInput from "../../components/Input/InputFile";
import { showNotification } from "../common/headerSlice";
import { useDispatch } from "react-redux";

function Requirements() {
  const dispatch = useDispatch();

  // State untuk semua file dokumen
  const [form, setForm] = useState({
    ktp: { file: null, previewUrl: "" },
    npwp: { file: null, previewUrl: "" },
    nib: { file: null, previewUrl: "" },
    tdp: { file: null, previewUrl: "" },
  });

  const updateFormValue = ({ updateType, value }) => {
    setForm((prev) => ({ ...prev, [updateType]: value }));
  };

  const updateDokumen = () => {
    // Validasi file yang wajib ada (contoh: KTP dan NPWP wajib)
    if (!form.ktp.file) {
      dispatch(
        showNotification({
          message: "File KTP wajib diupload",
          status: 0,
        })
      );
      return;
    }

    if (!form.npwp.file) {
      dispatch(
        showNotification({
          message: "File NPWP wajib diupload",
          status: 0,
        })
      );
      return;
    }

    // Contoh payload siap kirim
    console.log("Dokumen payload:", form);
    dispatch(
      showNotification({
        message: "Dokumen berhasil diupdate",
        status: 1,
      })
    );
  };

  return (
    <>
      <TitleCard title="Dokumen Tambahan" topMargin="mt-2">
        <div className="space-y-6">
          <div className="text-sm text-gray-600 mb-6">
            Upload dokumen-dokumen berikut untuk melengkapi verifikasi akun
            Anda. File yang diperbolehkan: PDF, JPG, JPEG, PNG (maksimal 5MB per
            file)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput
              labelTitle="File KTP"
              labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              updateType="ktp"
              updateFormValue={updateFormValue}
              defaultPreviewUrl={form.ktp.previewUrl}
            />

            <FileInput
              labelTitle="File NPWP"
              labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              updateType="npwp"
              updateFormValue={updateFormValue}
              defaultPreviewUrl={form.npwp.previewUrl}
            />

            <FileInput
              labelTitle="File NIB (Nomor Induk Berusaha)"
              accept=".pdf,.jpg,.jpeg,.png"
              updateType="nib"
              updateFormValue={updateFormValue}
              defaultPreviewUrl={form.nib.previewUrl}
            />

            <FileInput
              labelTitle="File TDP (Tanda Daftar Perusahaan)"
              accept=".pdf,.jpg,.jpeg,.png"
              updateType="tdp"
              updateFormValue={updateFormValue}
              defaultPreviewUrl={form.tdp.previewUrl}
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            className="btn btn-primary float-right"
            onClick={updateDokumen}
          >
            Simpan Dokumen
          </button>
        </div>
      </TitleCard>
    </>
  );
}

export default Requirements;
