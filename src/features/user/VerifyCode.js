import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import InputText from "../../components/Input/InputText";

function VerifyCode() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [counter, setCounter] = useState(60);

  const email = localStorage.getItem("pendingEmail") || "";
  const role = localStorage.getItem("role") || "";

  // hitung mundur
  useEffect(() => {
    if (counter <= 0) return;
    const t = setInterval(() => setCounter((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [counter]);

  // auto-close alert setelah 4 detik
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const updateFormValue = ({ updateType, value }) => {
    if (updateType === "code") setCode(value);
    setErrorMessage("");
    setInfoMessage("");
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    const trimmed = code.trim();
    if (trimmed === "") return setErrorMessage("Kode verifikasi wajib diisi.");
    if (!/^\d{6}$/.test(trimmed))
      return setErrorMessage("Kode harus 6 digit angka.");

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700)); // simulasi API
      setLoading(false);
      setInfoMessage("Verifikasi berhasil. Mengarahkan...");
      const target = role === "notaris" ? "/app/notaris/setup" : "/app/welcome";
      window.location.href = target;
    } catch (err) {
      setLoading(false);
      setErrorMessage("Kode verifikasi tidak valid atau sudah kadaluarsa.");
    }
  };

  const resendCode = async () => {
    if (counter > 0) return;
    setErrorMessage("");
    setInfoMessage("");
    try {
      await new Promise((r) => setTimeout(r, 500)); // simulasi API
      setInfoMessage(
        email
          ? `Kode baru telah dikirim ke ${email}.`
          : "Kode baru telah dikirim. Silakan cek email Anda."
      );
      setCounter(60);
    } catch (err) {
      setErrorMessage("Gagal mengirim ulang kode. Coba lagi nanti.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center`}
      style={{ backgroundColor: "#ccb0b2" }}
    >
      <div className="card mx-auto w-full max-w-5xl shadow-xl rounded-none md:rounded-xl overflow-hidden">
        <div
          className={`grid md:grid-cols-2 grid-cols-1`}
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #ccb0b2 100%)",
          }}
        >
          <div className="rounded-xl" style={{ backgroundColor: "#96696d" }}>
            <LandingIntro />
          </div>

          {/* Kolom kanan */}
          <div className="py-24 px-10 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-1 text-center text-black">
              Verifikasi Akun
            </h2>
            <div className="text-center mt-4 mb-6 text-black">
              Masukkan <b>kode verifikasi</b>
              {email
                ? ` yang kami kirim ke ${email}.`
                : " yang kami kirim ke email Anda."}
            </div>

            {/* ALERT ERROR */}
            {errorMessage && (
              <div className="mb-6 relative">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center relative">
                  {errorMessage}
                  <button
                    type="button"
                    className="absolute right-2 top-1 text-red-700 font-bold"
                    onClick={() => setErrorMessage("")}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* ALERT INFO */}
            {infoMessage && (
              <div className="mb-6 relative">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm text-center relative">
                  {infoMessage}
                  <button
                    type="button"
                    className="absolute right-2 top-1 text-green-700 font-bold"
                    onClick={() => setInfoMessage("")}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={submitForm}>
              <div className="mb-4 mt-[100px]">
                <InputText
                  type="text"
                  defaultValue={code}
                  updateType="code"
                  containerStyle="mt-4"
                  labelTitle="Kode Verifikasi"
                  placeholder="Masukkan 6 digit kode"
                  updateFormValue={updateFormValue}
                />
              </div>

              <div className="justify-center text-center mt-6">
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
                  Verifikasi
                </button>

                {/* Kirim ulang link */}
                <div className="mt-4 text-sm text-black">
                  {counter > 0 ? (
                    <span className="opacity-60">Kirim ulang ({counter}s)</span>
                  ) : (
                    <span
                      onClick={resendCode}
                      className="text-primary hover:underline hover:cursor-pointer"
                    >
                      Kirim ulang kode
                    </span>
                  )}
                </div>

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

export default VerifyCode;
