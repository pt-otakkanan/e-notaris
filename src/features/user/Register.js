import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputTextAuth from "../../components/Input/InputTextAuth";

function Register() {
  const INITIAL_REGISTER_OBJ = {
    name: "",
    password: "",
    emailId: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (registerObj.name.trim() === "")
      return setErrorMessage("Name is required! (use any value)");
    if (registerObj.emailId.trim() === "")
      return setErrorMessage("Email Id is required! (use any value)");
    if (registerObj.password.trim() === "")
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
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div
      className="min-h-screen bg-base-200 flex items-center"
      style={{
        backgroundColor: "#ccb0b2",
      }}
    >
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div
          className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-none md:rounded-xl"
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
          <div className="py-15 px-10">
            <h2 className="text-3xl font-bold mt-[65px] mb-1 text-center text-black">
              Selamat datang!
            </h2>
            <div className="text-center mt-4 mb-6 text-black">
              Masukkan detail Anda.{" "}
            </div>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputTextAuth
                  defaultValue={registerObj.name}
                  updateType="name"
                  containerStyle="mt-4"
                  labelTitle="Nama"
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
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
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
                  Daftar
                </button>

                <div className="text-center mt-4 text-black">
                  Sudah punya akun?{" "}
                  <Link to="/login">
                    <span className="text-black inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                      Masuk
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

export default Register;
