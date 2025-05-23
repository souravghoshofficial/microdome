import { useState } from "react";
import eyeOpen from "../assets/eye-line.svg";
import eyeClosed from "../assets/eye-off-line.svg";
import { useNavigate } from "react-router";


import axios from "axios";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = ({email , toast}) => {
  const navigate = useNavigate()
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showEyeIcon, setShowEyeIcon] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8)
      errors.push("Password must be at least 8 characters long.");
    if (!/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password))
      errors.push("Password must contain at least one special character.");
    if (!/[A-Z]/.test(password))
      errors.push("Password must contain at least one uppercase letter.");
    if (!/[a-z]/.test(password))
      errors.push("Password must contain at least one lowercase letter.");
    if (!/[0-9]/.test(password))
      errors.push("Password must contain at least one digit.");
    return errors;
  };

  const checkConfirmPassword = (password , confirmPassword) => {
    const errors = [];
    if(password !== confirmPassword){
      errors.push("Password and confirm password must be same")
    }
    return errors;
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    errors = checkConfirmPassword(password, confirmPassword)
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors([]);
    setLoading(true);
    setError("");


    axios
      .post(
        `${ApiUrl}/api/v1/users/reset-password`,
        {
          email: email,
          newpassword: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success("Password reset successfully")
        setTimeout(() => {
           navigate("/login")
        },3000);
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
      <div className="bg-white/5 backdrop-blur-md border border-white/20 md:w-[25%] w-[85%] p-4 lg:p-7 md:p-6 rounded-lg shadow-md text-white">
        <p className="text-center text-lg my-2">Reset Your Password</p>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
          <label htmlFor="password">Password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              required
              id="password"
              value={password}
              onChange={(e) => {
                e.target.value.length > 0
                  ? setShowEyeIcon(true)
                  : (setShowEyeIcon(false), setShowPassword(false));
                setPassword(e.target.value);
              }}
              placeholder="Enter new password"
              className="pl-3 pr-9 py-2 rounded w-full bg-transparent border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <img
              id="eye"
              src={showPassword ? eyeOpen : eyeClosed}
              className={`absolute w-5 h-5 top-3 right-2 cursor-pointer ${
                showEyeIcon ? "block" : "hidden"
              }`}
              onClick={togglePassword}
            />
          </div>
           <label htmlFor="confirm-password">Confirm Password</label>
              <input
              type="password"
              required
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              placeholder="Re-enter new password"
              className="pl-3 pr-9 py-2 rounded w-full bg-transparent border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          {passwordErrors.length > 0 && (
            <ul className="text-red-500 text-sm">
              {passwordErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer font-bold rounded mt-4 mb-4 py-2 text-center"
            disabled={loading}
          >
            Change Password
          </button>
        </form>
      </div>

  );
};

export default ResetPassword;
