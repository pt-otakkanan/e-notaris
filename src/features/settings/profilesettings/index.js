// src/pages/App/Settings/ProfileSettings.jsx
import { useEffect, useMemo, useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import InputText from "../../../components/Input/InputText";
import FileInput from "../../../components/Input/InputFile";
import { showNotification } from "../../common/headerSlice";
import { useDispatch } from "react-redux";
import SelectBox from "../../../components/Input/SelectBox";
import UserService from "../../../services/user.service";

function ProfileSettings() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  const [serverUser, setServerUser] = useState(null);
  const [serverIdentity, setServerIdentity] = useState(null);

  const roleId = useMemo(
    () => Number(localStorage.getItem("role_id") || 0),
    []
  );

  // helper status
  const normalizeStatus = (s) => (s || "").toString().trim().toLowerCase();

  const renderStatusBadge = (raw) => {
    const status = normalizeStatus(raw);
    const labelMap = {
      approved: "Disetujui",
      pending: "Menunggu",
      rejected: "Ditolak",
      disetujui: "Disetujui",
      menunggu: "Menunggu",
      ditolak: "Ditolak",
    };
    const label = labelMap[status] || "Tidak diketahui";

    const clsMap = {
      Disetujui:
        "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
      Menunggu:
        "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
      Ditolak:
        "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
      "Tidak diketahui":
        "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 inset-ring inset-ring-gray-400/20",
    };

    return <div className={clsMap[label]}>{label}</div>;
  };

  const [form, setForm] = useState({
    // profile
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    roleLabel: "",

    // identity
    nik: "",
    npwp: "",
    ktp: { file: null, previewUrl: "" },
    kk: { file: null, previewUrl: "" },
    npwp_file: { file: null, previewUrl: "" },
    ktp_notaris: { file: null, previewUrl: "" },
    ttd: { file: null, previewUrl: "" },
    photo: { file: null, previewUrl: "" }, // ⬅️ FOTO FORMAL

    // status (display only)
    status_verification: "",
    notes_verification: "",
  });

  const updateFormValue = ({ updateType, value }) => {
    setForm((prev) => ({ ...prev, [updateType]: value }));
  };

  const computeRoleLabel = (rid) => {
    if (rid === 1) return "Admin";
    if (rid === 2) return "Penghadap";
    if (rid === 3) return "Notaris";
    return "User";
  };

  // fetch profile
  useEffect(() => {
    (async () => {
      try {
        setLoadingProfile(true);
        const res = await UserService.getProfile();
        const u = res?.data?.user || {};
        const iden = res?.data?.identity || null;

        setServerUser(u);
        setServerIdentity(iden);

        // status di identity (fallback ke user)
        const status = iden?.status_verification ?? u.status_verification ?? "";
        const notes = iden?.notes_verification ?? u.notes_verification ?? "";

        setForm((prev) => ({
          ...prev,
          // profile
          name: u.name || "",
          email: u.email || "",
          phone: u.telepon || "",
          address: u.address || "",
          gender: u.gender || "",
          roleLabel: computeRoleLabel(roleId),

          // identity
          nik: iden?.ktp || "",
          npwp: iden?.npwp || "",
          ktp: { file: null, previewUrl: iden?.file_ktp || "" },
          kk: { file: null, previewUrl: iden?.file_kk || "" },
          npwp_file: { file: null, previewUrl: iden?.file_npwp || "" },
          ktp_notaris: { file: null, previewUrl: iden?.file_ktp_notaris || "" },
          ttd: { file: null, previewUrl: iden?.file_sign || "" },
          photo: { file: null, previewUrl: iden?.file_photo || "" }, // ⬅️ FOTO FORMAL

          status_verification: status,
          notes_verification: notes,
        }));
      } catch (e) {
        dispatch(
          showNotification({
            message: "Gagal mengambil profil.",
            status: 0,
          })
        );
      } finally {
        setLoadingProfile(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  // VALIDASI identity (FE)
  const validateIdentity = () => {
    if (!form.nik.trim()) return "NIK wajib diisi.";

    const mustKTP = !serverIdentity?.file_ktp && !form.ktp.file;
    if (mustKTP) return "File KTP wajib diunggah.";

    const mustKK = !serverIdentity?.file_kk && !form.kk.file;
    if (mustKK) return "File Kartu Keluarga wajib diunggah.";

    const mustSign = !serverIdentity?.file_sign && !form.ttd.file;
    if (mustSign) return "File Tanda Tangan (PNG) wajib diunggah.";

    // ⬇️ FOTO FORMAL wajib bila belum ada di server
    const mustPhoto = !serverIdentity?.file_photo && !form.photo.file;
    if (mustPhoto) return "Foto formal wajib diunggah.";

    if (roleId === 3) {
      const mustKTPNotaris =
        !serverIdentity?.file_ktp_notaris && !form.ktp_notaris.file;
      if (mustKTPNotaris)
        return "File KTP Notaris wajib diunggah untuk peran Notaris.";
    }

    // TTD harus PNG
    if (form.ttd.file) {
      const name = form.ttd.file.name.toLowerCase();
      if (!name.endsWith(".png")) return "Tanda tangan harus PNG.";
    }

    const imgOk = (f) =>
      !f ||
      [".jpg", ".jpeg", ".png"].some((ext) =>
        f.name?.toLowerCase().endsWith(ext)
      );

    if (form.ktp.file && !imgOk(form.ktp.file))
      return "KTP harus jpg/jpeg/png.";
    if (form.kk.file && !imgOk(form.kk.file)) return "KK harus jpg/jpeg/png.";
    if (form.npwp_file.file && !imgOk(form.npwp_file.file))
      return "NPWP harus jpg/jpeg/png.";
    if (form.ktp_notaris.file && !imgOk(form.ktp_notaris.file))
      return "KTP Notaris harus jpg/jpeg/png.";
    if (form.photo.file && !imgOk(form.photo.file))
      return "Foto formal harus jpg/jpeg/png.";

    return null;
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      await UserService.updateProfile({
        name: form.name,
        telepon: form.phone,
        address: form.address,
        gender: form.gender || undefined,
        // file_avatar: form.avatar?.file || undefined,
      });
      dispatch(
        showNotification({ message: "Profil berhasil diperbarui", status: 1 })
      );
    } catch (err) {
      const status = err?.response?.status;
      let msg = err?.response?.data?.message || "Gagal memperbarui profil.";
      if (status === 422) {
        const errs = err?.response?.data?.data;
        if (errs && typeof errs === "object") {
          const firstKey = Object.keys(errs)[0];
          const firstMsg = Array.isArray(errs[firstKey])
            ? errs[firstKey][0]
            : String(errs[firstKey]);
          msg = firstMsg || msg;
        }
      }
      dispatch(showNotification({ message: msg, status: 0 }));
    } finally {
      setSaving(false);
    }
  };

  const saveIdentity = async () => {
    const v = validateIdentity();
    if (v) {
      dispatch(showNotification({ message: v, status: 0 }));
      return;
    }
    try {
      setSaving(true);
      await UserService.updateIdentityProfile({
        ktp: form.nik,
        npwp: form.npwp || undefined,
        // ktp_notaris (string) opsional jika kamu sediakan input teks
        // ktp_notaris: ...,
        file_ktp: form.ktp.file || undefined,
        file_kk: form.kk.file || undefined,
        file_npwp: form.npwp_file.file || undefined,
        file_ktp_notaris: form.ktp_notaris.file || undefined,
        file_sign: form.ttd.file || undefined,
        file_photo: form.photo.file || undefined, // ⬅️ FOTO FORMAL DIKIRIM
      });
      dispatch(
        showNotification({
          message: "Identitas berhasil diperbarui",
          status: 1,
        })
      );
    } catch (err) {
      const status = err?.response?.status;
      let msg = err?.response?.data?.message || "Gagal memperbarui identitas.";
      if (status === 422) {
        const errs = err?.response?.data?.errors;
        if (errs && typeof errs === "object") {
          const firstKey = Object.keys(errs)[0];
          const firstMsg = Array.isArray(errs[firstKey])
            ? errs[firstKey][0]
            : String(errs[firstKey]);
          msg = firstMsg || msg;
        }
      }
      dispatch(showNotification({ message: msg, status: 0 }));
    } finally {
      setSaving(false);
    }
  };

  const onClickUpdate = () => {
    if (activeTab === "profile") return saveProfile();
    return saveIdentity();
  };

  return (
    <TitleCard title="Pengaturan Profil" topMargin="mt-2">
      {/* Tabs */}
      <div className="tabs mb-6">
        <div
          className={`tab tab-bordered transition-all duration-200 cursor-pointer ${
            activeTab === "profile"
              ? "tab-active text-white bg-[#0256c4] dark:bg-[#7b9cc9] dark:text-primary-content"
              : "bg-base-200 hover:bg-base-300 text-base-content dark:bg-[#01043c]"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profil Pengguna
        </div>
        <div
          className={`tab tab-bordered transition-all duration-200 cursor-pointer ${
            activeTab === "verifikasi"
              ? "tab-active text-white  bg-[#0256c4] dark:bg-[#7b9cc9] dark:text-primary-content"
              : "bg-base-200 hover:bg-base-300 text-base-content dark:bg-[#01043c]"
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
            value={form.name}
            updateFormValue={updateFormValue}
            updateType="name"
            isLoading={loadingProfile}
          />
          <InputText
            type="email"
            labelTitle="Email"
            value={form.email}
            disabled={true}
            updateFormValue={updateFormValue}
            updateType="email"
            isLoading={loadingProfile}
          />
          <InputText
            type="tel"
            labelTitle="Telepon"
            value={form.phone}
            updateFormValue={updateFormValue}
            updateType="phone"
            isLoading={loadingProfile}
          />
          <SelectBox
            labelTitle="Jenis Kelamin"
            placeholder="Pilih jenis kelamin"
            value={form.gender} // controlled
            updateType="gender"
            updateFormValue={updateFormValue}
            options={[
              { name: "Laki-laki", value: "male" },
              { name: "Perempuan", value: "female" },
              { name: "Lainnya", value: "lainnya" },
            ]}
          />
          <InputText
            labelTitle="Alamat"
            value={form.address}
            updateFormValue={updateFormValue}
            updateType="address"
            isLoading={loadingProfile}
          />

          <InputText
            labelTitle="Role"
            value={form.roleLabel}
            disabled={true}
            updateType="roleLabel"
            updateFormValue={updateFormValue}
            isLoading={loadingProfile}
          />
        </div>
      )}

      {/* Tab: Verifikasi */}
      {activeTab === "verifikasi" && (
        <div className="space-y-6">
          {/* ⬆️ Status verifikasi diletakkan di ATAS bagian identitas */}
          <div className="rounded-lg border border-base-300 p-4 bg-base-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-base-content/70">
                Status Verifikasi
              </span>
              {renderStatusBadge(form.status_verification || "-")}
            </div>

            {normalizeStatus(form.status_verification) === "rejected" &&
              form.notes_verification && (
                <div className="mt-2 text-sm">
                  <div className="font-medium mb-1">Catatan Penolakan</div>
                  <div className="rounded-md bg-red-50 p-3 text-red-700 border border-red-200">
                    {form.notes_verification}
                  </div>
                </div>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputText
              labelTitle="NIK"
              value={form.nik}
              updateFormValue={updateFormValue}
              updateType="nik"
              isLoading={loadingProfile}
            />
            <InputText
              labelTitle="NPWP"
              value={form.npwp}
              updateFormValue={updateFormValue}
              updateType="npwp"
              isLoading={loadingProfile}
            />
          </div>

          <div className="divider">Dokumen Pendukung</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput
              labelTitle="File KTP"
              accept=".jpg,.jpeg,.png"
              required={!serverIdentity?.file_ktp}
              maxSizeMB={2}
              updateType="ktp"
              updateFormValue={updateFormValue}
              defaultPreviewUrl={form.ktp.previewUrl}
            />
            <FileInput
              labelTitle="File Kartu Keluarga"
              accept=".jpg,.jpeg,.png"
              required={!serverIdentity?.file_kk}
              maxSizeMB={2}
              updateType="kk"
              updateFormValue={updateFormValue}
              defaultPreviewUrl={form.kk.previewUrl}
            />
            <FileInput
              labelTitle="File NPWP"
              accept=".jpg,.jpeg,.png"
              maxSizeMB={2}
              updateType="npwp_file"
              updateFormValue={updateFormValue}
              defaultPreviewUrl={form.npwp_file.previewUrl}
            />
            <FileInput
              labelTitle="File KTP Notaris"
              accept=".jpg,.jpeg,.png"
              required={roleId === 3 && !serverIdentity?.file_ktp_notaris}
              maxSizeMB={2}
              updateType="ktp_notaris"
              updateFormValue={updateFormValue}
              defaultPreviewUrl={form.ktp_notaris.previewUrl}
            />
            <FileInput
              labelTitle="File Tanda Tangan (PNG)"
              accept=".png"
              required={!serverIdentity?.file_sign}
              maxSizeMB={1} // BE: file_sign|max:1024
              updateType="ttd"
              updateFormValue={updateFormValue}
              defaultPreviewUrl={form.ttd.previewUrl}
            />

            <FileInput
              labelTitle="Foto Formal"
              accept=".jpg,.jpeg,.png"
              required={!serverIdentity?.file_photo}
              maxSizeMB={2}
              updateType="photo"
              updateFormValue={updateFormValue}
              defaultPreviewUrl={form.photo.previewUrl}
            />
          </div>
        </div>
      )}

      <div className="mt-16">
        <button
          className={`btn bg-[#0256c4] text-white hover:text-[#01043c] dark:bg-[#7b9cc9] dark:text-[#01043c] dark:hover:bg-gray-400 dark:hover:text-white float-right ${
            saving ? "loading" : ""
          }`}
          onClick={onClickUpdate}
          disabled={saving}
        >
          {activeTab === "profile" ? "Update Profil" : "Update Identitas"}
        </button>
      </div>
    </TitleCard>
  );
}

export default ProfileSettings;
