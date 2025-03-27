import React, { useState } from "react";
import { Link , useNavigate } from "react-router";
import lockIcon from "../assets/lock-line.svg";
import mailIcon from "../assets/mail-line.svg";
import eyeOpen from "../assets/eye-line.svg";
import eyeClosed from "../assets/eye-off-line.svg";



const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showEyeIcon, setShowEyeIcon] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { email, password };

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed. Please try again.");
      }

      const data = await response.json();
      console.log(data);
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error.message);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-[url(./assets/login-bg-mobile.jpeg)] lg:bg-[url(./assets/login-bg-desktop.jpg)] bg-cover w-full h-screen flex justify-center items-center">
      <div className="bg-white/5 backdrop-blur-md border border-white/20 lg:w-[23%] md:w-[25%] w-[85%] p-4 lg:p-7 md:p-6 rounded-lg shadow-md text-white">
        <h1 className="text-center font-bold text-3xl mt-2 text-emerald-500">
          MicroDome
        </h1>
        <p className="text-center text-lg mb-2">Log in to your Account</p>
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
          <label htmlFor="password" className="">
            Password
          </label>
          <div className="relative w-full">
            <img src={lockIcon} className="absolute w-5 h-5 top-2.5 left-2" />
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
              placeholder="Enter your password"
              className="px-9 py-2 rounded w-full bg-transparent border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <img
              id="eye"
              src={showPassword ? eyeOpen : eyeClosed}
              className={`absolute w-5 h-5 top-2.5 right-2 cursor-pointer ${
                showEyeIcon ? "block" : "hidden"
              }`}
              onClick={togglePassword}
            />
          </div>
          <p className="text-right cursor-pointer hover:text-emerald-300">
            Forgot Password ?
          </p>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer font-bold rounded mt-2 mb-4 py-2 text-center"
          >
            Login
          </button>
        </form>
        <p className="text-center">
          Don't have an account ?{" "}
          <Link to="/signup" className="font-bold hover:text-emerald-300">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
