import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import { color } from "chart.js/helpers";
import InputTextAuth from "../../components/Input/InputTextAuth";

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    emailId: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (loginObj.emailId.trim() === "")
      return setErrorMessage("Email Id is required! (use any value)");
    if (loginObj.password.trim() === "")
      return setErrorMessage("Password is required! (use any value)");
    else {
      setLoading(true);
      // Call API
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
      style={{
        backgroundColor: "#ccb0b2",
      }}
    >
      <div className="card mx-auto w-full max-w-5xl shadow-xl rounded-none md:rounded-xl overflow-hidden">
        <div
          className={`grid md:grid-cols-2 grid-cols-1`}
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #ccb0b2 100%)",
          }}
        >
          <div
            className="rounded-xl"
            style={{
              backgroundColor: "#96696d",
            }}
          >
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-3xl font-bold mb-1 text-center text-black">
              Selamat datang kembali!
            </h2>
            <div className="text-center mt-4 mb-6 text-black">
              Masukkan detail Anda.{" "}
            </div>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputTextAuth
                  type="emailId"
                  defaultValue={loginObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  updateFormValue={updateFormValue}
                />

                <InputTextAuth
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Kata Sandi"
                  updateFormValue={updateFormValue}
                />
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm mb-0 inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <ErrorText styleClass="mt-8 text-sm italic">
                {errorMessage}
              </ErrorText>
              <div className="justify-center text-center">
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
                  Masuk
                </button>

                <div className="text-center mt-4 text-black">
                  Belum punya akun?{" "}
                  <Link to="/register">
                    <span className="text-black inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                      Daftar
                    </span>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
