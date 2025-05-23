import { useState } from "react";
import { Link } from "react-router";
import mailIcon from "../assets/mail-line.svg";
import { OTPInput , ResetPassword } from "../components";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    axios
      .post(
        `${ApiUrl}/api/v1/users/forgot-password`,
        {
          email: email,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success("OTP send to your email")
        setShowOtpInput(true)
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 404) {
          setError("User does not exist");
        }
        if (err.status === 500) {
          setError("Internal Server Error");
        }
      })
      .finally(() => {
        setLoading(false)
      });
  };


  return (
    <div className="bg-[url(./assets/login-bg-mobile.jpeg)] lg:bg-[url(./assets/login-bg-desktop.jpg)] bg-cover w-full h-screen flex justify-center items-center">
      <ToastContainer />
      {!(showOtpInput || showResetPassword) && (
        <div className="bg-white/5 backdrop-blur-md border border-white/20 md:w-[25%] w-[85%] p-4 lg:p-7 md:p-6 rounded-lg shadow-md text-white">
        <p className="my-2 text-center text-lg">Reset Your Password</p>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <div className="relative w-full ">
            <img src={mailIcon} className="absolute w-5 h-5 top-2.5 left-2" />
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-9 py-2 rounded w-full bg-transparent border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer font-bold rounded mt-2 mb-4 py-2 text-center"
          >
            Continue
          </button>
        </form>
        <p className="text-center">
          Remember Password ?{" "}
          <Link to="/login" className="font-bold hover:text-emerald-300">
            Login
          </Link>
        </p>
      </div>
      )}
      {showOtpInput && (
        <OTPInput email={email} context={"forgot-password"} verifyOtpApiEndpoint={"verify-forgot-password-otp"} resendOtpApiEndpoint={"resend-forgot-password-otp"}  setShowResetPassword={setShowResetPassword} setShowOtpInput={setShowOtpInput} />
      )}
      {showResetPassword && (
        <ResetPassword email={email} />
      )}
    </div>
  );
};

export default ForgotPassword;
