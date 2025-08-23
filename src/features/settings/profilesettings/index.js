import { useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import InputText from "../../../components/Input/InputText";
import FileInput from "../../../components/Input/InputFile"; // ⬅️ PENTING: import komponen
import { showNotification } from "../../common/headerSlice";
import { useDispatch } from "react-redux";

function ProfileSettings() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");

  // Satu objek state untuk semua field
  const [form, setForm] = useState({
    // tab profile
    name: "Alex",
    email: "alex@dashwind.com",
    phone: "081944840048",
    address: "California",
    role: "Penghadap",

    // tab verifikasi
    nik: "357**********",
    npwp: "1234567890",
    ktp: { file: null, previewUrl: "" },
    kk: { file: null, previewUrl: "" },
    npwp_file: { file: null, previewUrl: "" },
    ktp_notaris: { file: null, previewUrl: "" },
    ttd: { file: null, previewUrl: "" },
  });

  const updateFormValue = ({ updateType, value }) => {
    setForm((prev) => ({ ...prev, [updateType]: value }));
  };

  const updateProfile = () => {
    // Contoh payload siap kirim (File ada di form.ktp.file, dst)
    // console.log("payload:", form);
    dispatch(showNotification({ message: "Profile Updated", status: 1 }));
  };

  return (
    <>
      <TitleCard title="Pengaturan Profil" topMargin="mt-2">
        {/* Tabs */}
        <div className="tabs mb-6">
          <div
            className={`tab tab-bordered transition-all duration-200 cursor-pointer ${
              activeTab === "profile"
                ? "tab-active text-white bg-[#96696d] dark:bg-[#92bbcc] dark:text-primary-content"
                : "bg-base-200 hover:bg-base-300 text-base-content"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profil Pengguna
          </div>
          <div
            className={`tab tab-bordered transition-all duration-200 cursor-pointer ${
              activeTab === "verifikasi"
                ? "tab-active text-white bg-[#96696d] dark:bg-[#92bbcc] dark:text-primary-content"
                : "bg-base-200 hover:bg-base-300 text-base-content"
            }`}
            onClick={() => setActiveTab("verifikasi")}
          >
            Verifikasi Identitas
          </div>
        </div>

        {/* Tab: Profil */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputText
              labelTitle="Nama Lengkap"
              labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
              defaultValue={form.name}
              updateFormValue={updateFormValue}
              updateType="name"
            />
            <InputText
              type="email"
              labelTitle="Email"
              labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
              defaultValue={form.email}
              updateFormValue={updateFormValue}
              updateType="email"
            />
            <InputText
              type="tel"
              labelTitle="Telepon"
              labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
              defaultValue={form.phone}
              updateFormValue={updateFormValue}
              updateType="phone"
            />
            <InputText
              labelTitle="Alamat"
              defaultValue={form.address}
              updateFormValue={updateFormValue}
              updateType="address"
            />
            <InputText
              labelTitle="Role"
              defaultValue={form.role}
              disabled={true}
              updateType="role"
              updateFormValue={updateFormValue}
            />
            <div className={`form-control w-full`}>
              <label className="label">
                <span className={"label-text text-base-content"}>
                  Status Verifikasi
                </span>
              </label>
              <div className="inline-flex w-[70px] items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20">
                Disetujui
              </div>
            </div>
          </div>
        )}

        {/* Tab: Verifikasi */}
        {activeTab === "verifikasi" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputText
                labelTitle="NIK"
                labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
                defaultValue={form.nik}
                updateFormValue={updateFormValue}
                updateType="nik"
              />
              <InputText
                labelTitle="NPWP"
                defaultValue={form.npwp}
                updateFormValue={updateFormValue}
                updateType="npwp"
              />
            </div>

            <div className="divider">Dokumen Pendukung</div>

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
                labelTitle="File Kartu Keluarga"
                labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
                accept=".pdf,.jpg,.jpeg,.png"
                required
                updateType="kk"
                updateFormValue={updateFormValue}
                defaultPreviewUrl={form.kk.previewUrl}
              />
              <FileInput
                labelTitle="File NPWP"
                accept=".pdf,.jpg,.jpeg,.png"
                updateType="npwp_file"
                updateFormValue={updateFormValue}
                defaultPreviewUrl={form.npwp_file.previewUrl}
              />
              <FileInput
                labelTitle="File KTP Notaris"
                accept=".pdf,.jpg,.jpeg,.png"
                required
                updateType="ktp_notaris"
                updateFormValue={updateFormValue}
                defaultPreviewUrl={form.ktp_notaris.previewUrl}
              />
              <div className="md:col-span-2">
                <FileInput
                  labelTitle="File Tanda Tangan"
                  labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  updateType="ttd"
                  updateFormValue={updateFormValue}
                  defaultPreviewUrl={form.ttd.previewUrl}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-16">
          <button
            className="btn btn-primary float-right"
            onClick={updateProfile}
          >
            Update
          </button>
        </div>
      </TitleCard>
    </>
  );
}

export default ProfileSettings;
