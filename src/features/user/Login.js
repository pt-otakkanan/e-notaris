import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    emailId: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  // auto-hide error setelah 4 detik
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (loginObj.emailId.trim() === "")
      return setErrorMessage("Email wajib diisi!");
    if (loginObj.password.trim() === "")
      return setErrorMessage("Kata sandi wajib diisi!");
    else {
      setLoading(true);
      // TODO: Panggil API login
      localStorage.setItem("token", "DumyTokenHere");
      setLoading(false);
      window.location.href = "/app/welcome";
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
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
          {/* Kolom kiri */}
          <div className="rounded-xl" style={{ backgroundColor: "#96696d" }}>
            <LandingIntro />
          </div>

          {/* Kolom kanan scrollable */}
          <div className="py-24 px-10 max-h-[80vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-1 text-center text-black">
              Selamat datang kembali!
            </h2>
            <div className="text-center mt-4 mb-4 text-black">
              Masukkan detail Anda.
            </div>

            {/* Alert error */}
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

            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="text"
                    value={loginObj.emailId}
                    onChange={(e) =>
                      updateFormValue({
                        updateType: "emailId",
                        value: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                    placeholder="Masukkan email"
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Kata Sandi</span>
                  </label>
                  <input
                    type="password"
                    value={loginObj.password}
                    onChange={(e) =>
                      updateFormValue({
                        updateType: "password",
                        value: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                    placeholder="Masukkan kata sandi"
                  />
                </div>
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm mb-0 inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Lupa kata sandi?
                  </span>
                </Link>
              </div>

              <div className="justify-center text-center mt-8">
                <button
                  type="submit"
                  className={
                    "btn w-60 text-white text-lg rounded-full border-gray-300 p-2 w-72" +
                    (loading ? " loading" : "")
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
                    <span className="text-black inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
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

export default Login;
