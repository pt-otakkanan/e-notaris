import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
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
      return setErrorMessage("Email Id is required! (use any value)");
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
          <div className="py-24 px-10">
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
                  Kami akan mengirimkan tautan reset kata sandi ke email Anda.
                </p>
                <form onSubmit={(e) => submitForm(e)}>
                  <div className="mb-4">
                    <InputText
                      type="emailId"
                      defaultValue={userObj.emailId}
                      updateType="emailId"
                      containerStyle="mt-4"
                      labelTitle="Email"
                      updateFormValue={updateFormValue}
                    />
                  </div>

                  <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                  <div className="text-center">
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
