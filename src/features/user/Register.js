import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputTextAuth from "../../components/Input/InputTextAuth";
import InputText from "../../components/Input/InputText";
import CheckCardGroup from "../../components/Input/CheckCardGroup";
import ScaleIcon from "@heroicons/react/24/outline/ScaleIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";

function Register() {
  const INITIAL_REGISTER_OBJ = {
    name: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    role: "", // "notaris" | "klien"
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);

  // Auto-dismiss alert setelah 4 detik
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (registerObj.name.trim() === "")
      return setErrorMessage("Nama Lengkap wajib diisi.");
    if (registerObj.emailId.trim() === "")
      return setErrorMessage("Email wajib diisi.");
    if (registerObj.password.trim() === "")
      return setErrorMessage("Kata Sandi wajib diisi.");
    if (registerObj.confirmPassword.trim() === "")
      return setErrorMessage("Konfirmasi Kata Sandi wajib diisi.");
    if (registerObj.password !== registerObj.confirmPassword)
      return setErrorMessage("Kata Sandi dan Konfirmasi tidak cocok.");
    if (!registerObj.role)
      return setErrorMessage("Pilih peran: Notaris atau Klien.");

    setLoading(true);
    // TODO: panggil API register di sini
    localStorage.setItem("token", "DumyTokenHere");
    localStorage.setItem("role", registerObj.role);
    localStorage.setItem("pendingEmail", registerObj.emailId); // untuk halaman verifikasi (opsional)
    setLoading(false);

    const target =
      registerObj.role === "notaris" ? "/app/notaris/setup" : "/app/welcome";
    window.location.href = target;
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div
      className="min-h-screen bg-base-200 flex items-center"
      style={{ backgroundColor: "#ccb0b2" }}
    >
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div
          className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-none md:rounded-xl"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #ccb0b2 100%)",
          }}
        >
          <div className="rounded-xl" style={{ backgroundColor: "#96696d" }}>
            <LandingIntro />
          </div>

          {/* Kolom kanan dibuat scrollable */}
          <div className="py-15 px-10 md:max-h-[80vh] md:overflow-y-auto">
            <h2 className="text-3xl font-bold mt-[65px] mb-1 text-center text-black">
              Selamat datang!
            </h2>
            <div className="text-center mt-4 mb-4 text-black">
              Masukkan detail Anda.
            </div>

            {/* ALERT ERROR di bawah "Masukkan detail Anda." */}
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

            <form onSubmit={submitForm}>
              <div className="mb-4">
                <InputTextAuth
                  defaultValue={registerObj.name}
                  updateType="name"
                  containerStyle="mt-4"
                  labelTitle="Nama Lengkap"
                  updateFormValue={updateFormValue}
                />

                <InputTextAuth
                  defaultValue={registerObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  updateFormValue={updateFormValue}
                />

                <InputTextAuth
                  defaultValue={registerObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Kata Sandi"
                  updateFormValue={updateFormValue}
                />

                {/* Konfirmasi Kata Sandi */}
                <InputText
                  defaultValue={registerObj.confirmPassword}
                  type="password"
                  updateType="confirmPassword"
                  containerStyle="mt-4"
                  labelTitle="Konfirmasi Kata Sandi"
                  updateFormValue={updateFormValue}
                />

                {/* Pilihan Peran (checkbox-look, radio-behavior) */}
                <CheckCardGroup
                  labelTitle=""
                  labelDescription="Pilih peran Anda dalam sistem"
                  containerStyle="mt-4"
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
                    "btn mt-1 w-60 border-r-0 text-white text-lg rounded-full border-gray-300 p-2 w-72 placeholder-gray-500" +
                    (loading ? " loading" : "")
                  }
                  style={{
                    backgroundColor: "#474747",
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

export default Register;
