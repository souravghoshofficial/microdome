import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { RiMenuFill , RiCloseLine } from "@remixicon/react";


const Navbar = () => {
  const [showSideNav, setShowSideNav] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 w-full border-b border-gray-950/[.1] dark:border-gray-50/[.1]  flex items-center justify-center z-50 backdrop-blur-md text-black dark:text-white">
      <div className="w-[90%] py-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-lg font-bold" href="#">
            MicroDome
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className="hover:underline hover:underline-offset-4 decoration-gray-800 dark:decoration-white">Home</NavLink>
          <NavLink to="/courses" className="hover:underline hover:underline-offset-4 decoration-gray-800 dark:decoration-white">Courses</NavLink>
          <NavLink className="hover:underline hover:underline-offset-4 decoration-gray-800 dark:decoration-white">About Us</NavLink>
          <NavLink className="hover:underline hover:underline-offset-4 decoration-gray-800 dark:decoration-white">Resources</NavLink>
          <div className=" flex items-center gap-3">
            <NavLink to="/login" className="px-3 py-1.5 border ">
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="px-3 py-1.5 bg-black border border-black text-white dark:bg-white dark:border-white dark:text-black"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
        <div className="block md:hidden">
          {/* <img className="w-6 h-6" src={ham} onClick={() => setShowSideNav(true)} alt="menu" /> */}
          <RiMenuFill size={24} onClick={() => setShowSideNav(true)} />
        </div>
      </div>
      <div
        className={`md:hidden ${
          showSideNav ? "block" : "hidden"
        } absolute top-0 w-full h-screen z-50 flex items-start justify-items-start bg-white dark:bg-gray-950`}
      >
        <div className="w-[90%] absolute top-0 left-[50%] translate-x-[-50%] flex items-center justify-between py-4">
          <Link to="/" className="text-lg font-bold">
            MicroDome
          </Link>
          {/* <img src={xmark} onClick={() => setShowSideNav(false)} className="w-6 h-6" alt="x mark" /> */}
          <RiCloseLine size={24} onClick={() => setShowSideNav(false)} />
        </div>
        <div className="w-[90%] mx-auto mt-32 flex flex-col gap-4">
          <NavLink to="/" className="text-lg">Home</NavLink>
          <NavLink to="/courses" className="text-lg">Courses</NavLink>
          <NavLink className="text-lg">About Us</NavLink>
          <NavLink className="text-lg">Resources</NavLink>
          <NavLink
            to="/login"
            className=" w-full py-2 text-center text-lg border"
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className="w-full py-2 text-center text-lg bg-black border border-black text-white dark:text-black dark:bg-white dark:border-white"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
