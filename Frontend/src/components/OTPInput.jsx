import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login , logout } from "../features/auth/authSlice";
import axios from "axios";
import { useNavigate } from "react-router";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const OtpLength = 6;

const OTPInput = ({email , context, verifyOtpApiEndpoint , resendOtpApiEndpoint , otpVerifyNotification, otpSendNotification, setShowResetPassword = null , setShowOtpInput = null}) => {
  const navigate =  useNavigate()
  const dispatch =  useDispatch()
  const refArr = useRef([]);
  const [OTP, setOTP] = useState(new Array(OtpLength).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(15);
  const [showResendOTPText, setShowResendOTPText] = useState(false);

  const handleOnChange = (value, index) => {
    if (isNaN(value)) return;

    const newArr = [...OTP];
    newArr[index] = value.trim().slice(-1);
    setOTP(newArr);
    value.trim() && refArr.current[index + 1]?.focus();
  };

  const handleOnKeyDown = (e, index) => {
    if (!e.target.value && e.key === "Backspace") {
      refArr.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    refArr.current[0]?.focus();
  }, []);

    useEffect(() => {
    // Countdown timer logic
    if (secondsLeft === 0) {
      setShowResendOTPText(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [secondsLeft , setSecondsLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (OTP.includes("")) {
      setError("Please enter all digits of the OTP.");
      return;
    }

    const fullOTP = OTP.join("");

    axios
      .post(
        `${ApiUrl}/api/v1/users/${verifyOtpApiEndpoint}`,
        {
          email: email,
          otp: fullOTP,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if(context === "signup"){
        () => {
          otpVerifyNotification("OTP verified")
          otpVerifyNotification("Account created successfully")
        }
        dispatch(logout())
        dispatch(login(res.data.data.user));
        setTimeout(() => {
          navigate("/");
        }, 3000);
        }
        if(context === "forgot-password"){
          () => {
            otpVerifyNotification("OTP verified successfully")
          }
          setShowResetPassword(true)
          setShowOtpInput(false);
        }
      })
      .catch((err) => {
        console.log(err); 
        setError(err.response.data.message)
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResendOTP = async => {
    setError("")
    setSecondsLeft(15);
    setShowResendOTPText(false)

     axios
      .post(
        `${ApiUrl}/api/v1/users/${resendOtpApiEndpoint}`,
        {
          email: email,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        () => {
          otpSendNotification("OTP resend to your email")
        }
      })
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 md:w-[25%] w-[85%] p-4 lg:p-7 md:p-6 rounded-lg shadow-md text-white">
      <h2 className="my-1 text-center text-lg font-bold">Validate Your OTP</h2>
      <p className="text-center">Please enter the OTP sent to</p>
      <p className="text-center text-sm">{email}</p>
      <form onSubmit={handleSubmit}>
        <div className="w-full my-4 flex items-center justify-center gap-2">
          {OTP.map((item, index) => (
            <input
              key={index}
              type="text"
              ref={(input) => (refArr.current[index] = input)}
              value={OTP[index]}
              onChange={(e) => handleOnChange(e.target.value, index)}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
              className="h-10 w-10 text-center text-lg rounded  bg-transparent border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="block w-full bg-emerald-600 hover:bg-emerald-500 cursor-pointer font-bold rounded mt-2 py-2 text-center"
        >
           {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <p className="mt-4 text-center">
        Not recieved your code ?{" "}
        {showResendOTPText && (
          <span onClick={handleResendOTP}
          className="font-bold hover:text-emerald-300 cursor-pointer">
          Resend Code
        </span>
        )}

        {!showResendOTPText && (
          <span>00:{secondsLeft > 9 ? secondsLeft : `0${secondsLeft}` }</span>
        )}
      </p>
    </div>
  );
};

export default OTPInput;
