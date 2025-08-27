import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputTextAuth from "../../components/Input/InputTextAuth";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";

function ForgotPassword() {
  const INITIAL_USER_OBJ = {
    emailId: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (userObj.emailId.trim() === "")
      return setErrorMessage("Email wajib diisi!");
    else {
      setLoading(true);
      // Call API
      setLoading(false);
      setLinkSent(true);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setUserObj({ ...userObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1  bg-white rounded-none md:rounded-xl">
          <div
            className="rounded-xl"
            style={{
              backgroundColor: "#96696d",
            }}
          >
            <LandingIntro />
          </div>
          <div className="py-24 px-10 max-h-[87vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-1 mt-[50px] text-center text-black">
              Lupa Kata Sandi
            </h2>

            {linkSent && (
              <>
                <div className="text-center mt-8">
                  <CheckCircleIcon className="inline-block w-32 text-success" />
                </div>
                <p className="my-4 text-xl font-bold text-center">Link Sent</p>
                <p className="mt-4 mb-8 font-semibold text-center">
                  Cek email Anda untuk mengatur ulang kata sandi Anda.
                </p>
                <div className="text-center mt-4">
                  <Link to="/login">
                    <button className="btn btn-block btn-primary ">
                      Masuk
                    </button>
                  </Link>
                </div>
              </>
            )}

            {!linkSent && (
              <>
                <p className="text-center mt-4 mb-6 text-black">
                  Kami akan mengirimkan tautan reset kata sandi <br></br> ke
                  email Anda.
                </p>

                <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                <form onSubmit={(e) => submitForm(e)}>
                  <div className="mb-4">
                    <InputTextAuth
                      type="emailId"
                      defaultValue={userObj.emailId}
                      updateType="emailId"
                      containerStyle="mt-4"
                      labelTitle="Email"
                      placeholder="Masukkan email"
                      updateFormValue={updateFormValue}
                    />
                  </div>

                  <div className="justify-center text-center mt-8">
                    <button
                      type="submit"
                      className={
                        "btn w-72 text-white text-lg rounded-full border-gray-300 p-2 bg-[#0256c4] hover:bg-[#003782]" +
                        (loading ? " loading" : "")
                      }
                      style={{
                        width: "240px",
                        height: "45px",
                      }}
                    >
                      Kirim Tautan Reset
                    </button>

                    <div className="text-center mt-4 text-black">
                      Belum punya akun?{" "}
                      <Link to="/register">
                        <button className="text-black inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                          Daftar
                        </button>
                      </Link>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
