import React from "react";
import { useState } from "react";
import { NavLink } from "react-router";
import ham from "../assets/bars-solid.svg";
import xmark from "../assets/xmark-solid.svg";

const Navbar = () => {
  const [showSideNav, setShowSideNav] = useState(false);
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-center z-50 backdrop-blur-md">
      <div className="w-[90%] py-4 flex items-center justify-between">
        <div>
          <a className="text-lg font-bold" href="#">
            MicroDome
          </a>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <NavLink className="hover:underline hover:underline-offset-4 decoration-gray-800">Home</NavLink>
          <NavLink className="hover:underline hover:underline-offset-4 decoration-gray-800" to="/courses">Courses</NavLink>
          <a href="#about" className="hover:underline hover:underline-offset-4 decoration-gray-800">About Us</a>
          <NavLink className="hover:underline hover:underline-offset-4 decoration-gray-800">Resources</NavLink>
          <div className=" flex items-center gap-3">
            <NavLink to="/login" className="px-3 py-1.5 border border-black">
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="px-3 py-1.5 bg-black border border-black text-white"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
        <div className="block md:hidden">
          <img className="w-6 h-6" src={ham} onClick={() => setShowSideNav(true)} alt="menu" />
        </div>
      </div>
      <div
        className={`md:hidden ${
          showSideNav ? "block" : "hidden"
        } absolute top-0 w-full h-screen flex items-start justify-items-start bg-white`}
      >
        <div className="w-[90%] absolute top-0 left-[50%] translate-x-[-50%] flex items-center justify-between py-4">
          <a href="#" className="text-lg font-bold">
            MicroDome
          </a>
          <img src={xmark} onClick={() => setShowSideNav(false)} className="w-6 h-6" alt="x mark" />
        </div>
        <div className="w-[90%] mx-auto mt-32 flex flex-col gap-4">
          <NavLink className="text-lg">Home</NavLink>
          <NavLink to="/courses" className="text-lg">Courses</NavLink>
          <NavLink className="text-lg">About Us</NavLink>
          <NavLink className="text-lg">Resources</NavLink>
          <NavLink
            to="/login"
            className=" w-full py-2 text-center text-lg border border-black"
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className="w-full py-2 text-center text-lg bg-black border border-black text-white"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
