import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import InputText from "../../components/Input/InputText";
import AuthService from "../../services/auth.service";

export default function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil email dari state (prefer), fallback ke localStorage (opsional)
  const emailFromState = location?.state?.email || "";
  const [email, setEmail] = useState(
    emailFromState || localStorage.getItem("pendingEmail") || ""
  );
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [counter, setCounter] = useState(60);

  // countdown resend
  useEffect(() => {
    if (counter <= 0) return;
    const t = setInterval(() => setCounter((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [counter]);

  // auto-close alert
  useEffect(() => {
    if (!errorMessage && !infoMessage) return;
    const timer = setTimeout(() => {
      setErrorMessage("");
      setInfoMessage("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [errorMessage, infoMessage]);

  const updateFormValue = ({ updateType, value }) => {
    if (updateType === "code") setCode(value.toUpperCase());
    if (updateType === "email") setEmail(value);
    setErrorMessage("");
    setInfoMessage("");
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!email.trim()) return setErrorMessage("Email wajib diisi.");
    const trimmed = code.trim().toUpperCase();

    // BE generate: 7 char alfanumerik uppercase
    if (!/^[A-Z0-9]{7}$/.test(trimmed)) {
      return setErrorMessage("Kode harus 7 karakter (huruf/angka).");
    }

    try {
      setLoading(true);
      await AuthService.verifyEmail({ email, kode: trimmed });

      // bersihkan penyimpanan sementara (opsional)
      localStorage.removeItem("pendingEmail");

      // Sukses → lempar ke login dengan flash success + prefill email
      navigate("/login", {
        replace: true,
        state: {
          email,
          flash: {
            type: "success",
            message: "Email berhasil diverifikasi. Silakan login.",
          },
        },
      });
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || "Verifikasi gagal.";

      if (status === 400 && /kadaluarsa/i.test(msg)) {
        setInfoMessage("Kode kadaluarsa. Kode baru telah dikirim ke email.");
        setCounter(60);
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (counter > 0) return;
    if (!email.trim()) {
      setErrorMessage("Isi email terlebih dahulu untuk kirim ulang kode.");
      return;
    }
    setErrorMessage("");
    setInfoMessage("");

    try {
      await AuthService.resendCode({ email });
      setInfoMessage(`Kode baru telah dikirim ke ${email}.`);
      setCounter(60);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || "Gagal mengirim ulang kode.";
      if (status === 429) {
        setErrorMessage(msg); // throttle: “Tunggu xx detik...”
      } else if (status === 404) {
        setErrorMessage("Email tidak ditemukan.");
      } else if (status === 400) {
        setErrorMessage("Email sudah terverifikasi.");
      } else {
        setErrorMessage(msg);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center"
      style={{ backgroundColor: "#ccb0b2" }}
    >
      <div className="card mx-auto w-full max-w-5xl shadow-xl rounded-none md:rounded-xl overflow-hidden">
        <div
          className="grid md:grid-cols-2 grid-cols-1"
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

            {/* ERROR */}
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

            {/* INFO */}
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
              {/* Email (editable) */}
              <div className="mb-2">
                <InputText
                  type="email"
                  defaultValue={email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  placeholder="Masukkan email yang didaftarkan"
                  updateFormValue={updateFormValue}
                />
              </div>

              {/* Kode verifikasi 7-char */}
              <div className="mb-4 mt-4">
                <InputText
                  type="text"
                  defaultValue={code}
                  updateType="code"
                  containerStyle="mt-4"
                  labelTitle="Kode Verifikasi"
                  placeholder="Masukkan 7 karakter (huruf/angka)"
                  updateFormValue={updateFormValue}
                />
              </div>

              <div className="justify-center text-center mt-6">
                <button
                  type="submit"
                  className={
                    "btn mt-1 w-60 border-r-0 text-white text-lg rounded-full border-gray-300 p-2 w-72"
                  }
                  style={{
                    backgroundColor: "#474747",
                    width: "240px",
                    height: "45px",
                  }}
                >
                  Verifikasi
                </button>

                {/* Resend */}
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
                    <span className="text-black inline-block hover:underline hover:cursor-pointer transition duration-200">
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
