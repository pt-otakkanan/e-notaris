// src/pages/Register/index.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import InputTextAuth from "../../components/Input/InputTextAuth";
import CheckCardGroup from "../../components/Input/CheckCardGroup";
import ScaleIcon from "@heroicons/react/24/outline/ScaleIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import AuthService from "../../services/auth.service";

export default function Register() {
  const navigate = useNavigate();

  const INITIAL_REGISTER_OBJ = {
    name: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    role: "", // "notaris" | "klien"
  };

  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-dismiss alert setelah 4 detik
  useEffect(() => {
    if (!errorMessage && !successMessage) return;
    const t = setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 4000);
    return () => clearTimeout(t);
  }, [errorMessage, successMessage]);

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setSuccessMessage("");
    setRegisterObj((s) => ({ ...s, [updateType]: value }));
  };

  const roleToId = (role) => {
    if (role === "notaris") return 3;
    if (role === "klien") return 2; // penghadap
    return null;
    // NB: backend hanya menerima 2 atau 3
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validasi front-end ringan
    if (!registerObj.name.trim())
      return setErrorMessage("Nama Lengkap wajib diisi.");
    if (!registerObj.emailId.trim())
      return setErrorMessage("Email wajib diisi.");
    if (!registerObj.password.trim())
      return setErrorMessage("Kata Sandi wajib diisi.");
    if (!registerObj.confirmPassword.trim())
      return setErrorMessage("Konfirmasi Kata Sandi wajib diisi.");
    if (registerObj.password !== registerObj.confirmPassword)
      return setErrorMessage("Kata Sandi dan Konfirmasi tidak cocok.");
    if (!registerObj.role)
      return setErrorMessage("Pilih peran: Notaris atau Klien.");

    const role_id = roleToId(registerObj.role);
    if (!role_id) return setErrorMessage("Peran tidak valid.");

    try {
      setLoading(true);

      // Panggil API register (sesuai AuthController::registerUser)
      await AuthService.register({
        name: registerObj.name,
        email: registerObj.emailId,
        password: registerObj.password,
        confirmPassword: registerObj.confirmPassword,
        role_id, // 2 penghadap / 3 notaris
      });

      setSuccessMessage(
        "Register berhasil. Kode verifikasi telah dikirim ke email."
      );
      // Arahkan ke halaman verifikasi, bawa email agar input terisi otomatis
      navigate("/verify-code", {
        replace: true,
        state: { email: registerObj.emailId, from: "register" },
      });
    } catch (err) {
      // Tangani error dari backend (422 / message umum)
      const status = err?.response?.status;
      if (status === 422) {
        const errs = err?.response?.data?.data;
        if (errs && typeof errs === "object") {
          // Ambil pesan error pertama dari field validasi laravel
          const firstKey = Object.keys(errs)[0];
          const firstMsg = Array.isArray(errs[firstKey])
            ? errs[firstKey][0]
            : String(errs[firstKey]);
          setErrorMessage(firstMsg || "Proses validasi gagal.");
        } else {
          setErrorMessage(
            err?.response?.data?.message || "Proses validasi gagal."
          );
        }
      } else {
        setErrorMessage(err?.response?.data?.message || "Register gagal.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-none md:rounded-xl bg-white">
          <div className="rounded-xl" style={{ backgroundColor: "#96696d" }}>
            <LandingIntro />
          </div>

          {/* Kolom kanan scrollable */}
          <div className="py-15 px-10 md:max-h-[80vh] md:overflow-y-auto">
            <h2 className="text-3xl font-bold mt-[65px] mb-1 text-center text-black">
              Selamat datang!
            </h2>
            <div className="text-center mt-4 mb-4 text-black">
              Masukkan detail Anda.
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div className="mb-6 relative">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center relative">
                  {errorMessage}
                  <button
                    type="button"
                    className="absolute right-2 top-1 text-red-700 font-bold"
                    onClick={() => setErrorMessage("")}
                    aria-label="Tutup alert"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            {successMessage && (
              <div className="mb-6 relative">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm text-center relative">
                  {successMessage}
                  <button
                    type="button"
                    className="absolute right-2 top-1 text-green-700 font-bold"
                    onClick={() => setSuccessMessage("")}
                    aria-label="Tutup alert"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={submitForm}>
              <div className="mb-4">
                <InputTextAuth
                  defaultValue={registerObj.name}
                  updateType="name"
                  containerStyle="mt-4"
                  labelTitle="Nama Lengkap"
                  updateFormValue={updateFormValue}
                  placeholder={"Masukkan nama lengkap Anda"}
                />

                <InputTextAuth
                  defaultValue={registerObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  updateFormValue={updateFormValue}
                  placeholder="Masukkan email"
                />

                <InputTextAuth
                  defaultValue={registerObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Kata Sandi"
                  updateFormValue={updateFormValue}
                  placeholder="Masukkan kata sandi"
                />

                <InputTextAuth
                  defaultValue={registerObj.confirmPassword}
                  type="password"
                  updateType="confirmPassword"
                  containerStyle="mt-4 text-black"
                  labelTitle="Konfirmasi Kata Sandi"
                  updateFormValue={updateFormValue}
                  placeholder="Masukkan ulang kata sandi"
                />

                {/* Pilihan Peran */}
                <CheckCardGroup
                  labelTitle=""
                  labelDescription="Pilih peran Anda dalam sistem"
                  containerStyle="mt-6 text-black"
                  options={[
                    {
                      name: "Notaris",
                      value: "notaris",
                      description: "",
                      icon: <ScaleIcon className="w-6 h-6" />,
                    },
                    {
                      name: "Klien",
                      value: "klien",
                      description: "",
                      icon: <UserIcon className="w-6 h-6" />,
                    },
                  ]}
                  defaultValue={registerObj.role || ""}
                  updateType="role"
                  updateFormValue={updateFormValue}
                />
              </div>

              <div className="justify-center text-center pb-6">
                <button
                  type="submit"
                  className={
                    "btn mt-1 w-60 mt-6 border-r-0 text-white text-lg rounded-full border-gray-300 p-2 w-72 bg-[#0256c4]"
                  }
                  style={{
                    width: "240px",
                    height: "45px",
                  }}
                >
                  Daftar
                </button>

                <div className="text-center mt-4 text-black">
                  Sudah punya akun?{" "}
                  <Link to="/login">
                    <span className="text-black inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                      Masuk
                    </span>
                  </Link>
                </div>
              </div>
            </form>
          </div>
          {/* /Kolom kanan */}
        </div>
      </div>
    </div>
  );
}
