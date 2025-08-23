import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import InputTextAuth from "../../components/Input/InputTextAuth";
import AuthService from "../../services/auth.service";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const INITIAL_LOGIN_OBJ = { emailId: "", password: "" };

  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [flash, setFlash] = useState({ type: "", message: "" });

  // Prefill email & flash message dari navigate state (mis. dari Verify/RequireAuth)
  useEffect(() => {
    const emailFromState = location?.state?.email;
    if (emailFromState) {
      setLoginObj((s) => ({ ...s, emailId: emailFromState }));
    }
    const incomingFlash = location?.state?.flash;
    if (incomingFlash?.message) setFlash(incomingFlash);

    // bersihkan state agar tidak muncul lagi saat back/forward
    // (opsional) navigate(".", { replace: true });
    // eslint-disable-next-line
  }, []);

  // Auto-hide error & flash
  useEffect(() => {
    if (!errorMessage && !flash.message) return;
    const t = setTimeout(() => {
      setErrorMessage("");
      setFlash({ type: "", message: "" });
    }, 4000);
    return () => clearTimeout(t);
  }, [errorMessage, flash]);

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setFlash({ type: "", message: "" });
    setLoginObj((s) => ({ ...s, [updateType]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFlash({ type: "", message: "" });

    if (!loginObj.emailId.trim()) return setErrorMessage("Email wajib diisi!");
    if (!loginObj.password.trim())
      return setErrorMessage("Kata sandi wajib diisi!");

    try {
      setLoading(true);

      await AuthService.login({
        email: loginObj.emailId,
        password: loginObj.password,
      });

      // Berhasil login → balik ke tujuan awal atau /app/welcome
      const fallback = "/app/welcome";
      const from = location.state?.from?.pathname || fallback;
      navigate(from, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        "Gagal masuk. Silakan periksa email dan kata sandi Anda.";

      if (status === 422) {
        const errs = err?.response?.data?.data;
        if (errs && typeof errs === "object") {
          const firstKey = Object.keys(errs)[0];
          const firstMsg = Array.isArray(errs[firstKey])
            ? errs[firstKey][0]
            : String(errs[firstKey] || msg);
          setErrorMessage(firstMsg);
        } else {
          setErrorMessage(msg);
        }
        return;
      }

      if (status === 403) {
        // Belum verifikasi → lempar ke VerifyCode dengan email
        navigate("/verify-code", {
          replace: true,
          state: { email: loginObj.emailId, from: "login" },
        });
        return;
      }

      setErrorMessage(msg);
    } finally {
      setLoading(false);
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

          <div className="py-24 px-10 max-h-[87vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-1 text-center text-black">
              Selamat datang kembali!
            </h2>
            <div className="text-center mt-4 mb-6 text-black">
              Masukkan detail Anda.
            </div>

            {/* FLASH (success/warning) */}
            {flash.message && (
              <div className="mb-6 relative">
                <div
                  className={`px-4 py-3 rounded text-sm text-center relative border ${
                    flash.type === "success"
                      ? "bg-green-100 border-green-400 text-green-700"
                      : "bg-yellow-100 border-yellow-400 text-yellow-800"
                  }`}
                >
                  {flash.message}
                  <button
                    type="button"
                    className="absolute right-2 top-1 font-bold"
                    onClick={() => setFlash({ type: "", message: "" })}
                    aria-label="Tutup"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* ERROR */}
            {errorMessage && (
              <div className="mb-6 relative">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center relative">
                  {errorMessage}
                  <button
                    type="button"
                    className="absolute right-2 top-1 text-red-700 font-bold"
                    onClick={() => setErrorMessage("")}
                    aria-label="Tutup"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={submitForm}>
              <div className="mb-4">
                <InputTextAuth
                  defaultValue={loginObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  updateFormValue={updateFormValue}
                  className="input input-bordered w-full"
                  placeholder="Masukkan email"
                />

                <InputTextAuth
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Kata Sandi"
                  updateFormValue={updateFormValue}
                  className="input input-bordered w-full"
                  placeholder="Masukkan kata sandi"
                />
              </div>

              <div className="text-right">
                <Link to="/forgot-password">
                  <span className="text-sm inline-block hover:underline hover:cursor-pointer transition duration-200 text-black">
                    Lupa kata sandi?
                  </span>
                </Link>
              </div>

              <div className="justify-center text-center mt-8">
                <button
                  type="submit"
                  className={
                    "btn w-72 text-white text-lg rounded-full border-gray-300 p-2"
                  }
                  style={{
                    backgroundColor: "#474747",
                    width: "240px",
                    height: "45px",
                  }}
                >
                  Masuk
                </button>

                <div className="text-center mt-4 text-black">
                  Belum punya akun?{" "}
                  <Link to="/register">
                    <span className="inline-block hover:underline hover:cursor-pointer transition duration-200 text-black">
                      Daftar
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
