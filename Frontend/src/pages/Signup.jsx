import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import eyeOpen from "../assets/eye-line.svg";
import eyeClosed from "../assets/eye-off-line.svg";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [user, setUser] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors([]);
    setLoading(true);
    setError("");

    const newUser = { name, roll, email, password };

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Signup failed. Please try again."
        );
      }

      const data = await response.json();
      console.log("Signup Success:", data);
      setUser(newUser);
      navigate("/login");

      // Clear form
      setName("");
      setRoll("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url(./assets/login-bg-mobile.jpeg)] lg:bg-[url(./assets/login-bg-desktop.jpg)] bg-cover w-full h-screen flex justify-center items-center">
      <div className="bg-white/5 backdrop-blur-md border border-white/20 lg:w-[23%] md:w-[25%] w-[85%] p-4 lg:p-7 md:p-6 rounded-lg shadow-md text-white">
        <h1 className="text-center font-bold text-3xl mt-2 text-emerald-500">
          MicroDome
        </h1>
        <p className="text-center text-lg mb-2">Create your Account</p>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="px-3 py-2 rounded w-full bg-transparent border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            required
          />
          <label htmlFor="mobile">Mobile No</label>
          <input
            type="number"
            pattern="[0-9]{12}"
            id="mobile"
            value={roll}
            onChange={(e) => {
              console.log(e.target.value);
              setRoll(e.target.value);
            }}
            placeholder="Enter your mobile number"
            className="remove-arrow px-3 py-2 rounded w-full bg-transparent border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-3 py-2 rounded w-full bg-transparent border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            required
          />
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
              placeholder="Enter your password"
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
            {loading ? "Signing Up..." : "Signup"}
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-bold hover:text-emerald-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
