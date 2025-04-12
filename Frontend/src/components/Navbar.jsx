import React from "react";
import { useState , useEffect } from "react";
import { NavLink } from "react-router";
import { RiMenuFill , RiCloseLine } from "@remixicon/react";
import Logo from "./Logo";
import ThemeBtn from "./ThemeBtn";



const Navbar = () => {

  const [showSideNav, setShowSideNav] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 w-full border-b border-gray-950/[.1] dark:border-gray-50/[.1]  flex items-center justify-center z-50 backdrop-blur-2xl text-black dark:text-white">
      <div className="w-[90%] py-4 flex items-center justify-between">
        <div>
        <a className="flex items-center gap-2" href="/">
        <Logo className="w-7 md:w-9" />
          <p className="text-lg font-bold gradiant-text">Microdome</p>
        </a>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className="hover:underline hover:underline-offset-4 decoration-gray-800 dark:decoration-white">Home</NavLink>
          <NavLink to="/courses" className="hover:underline hover:underline-offset-4 decoration-gray-800 dark:decoration-white">Courses</NavLink>
          <NavLink className="hover:underline hover:underline-offset-4 decoration-gray-800 dark:decoration-white">About Us</NavLink>
          <NavLink className="hover:underline hover:underline-offset-4 decoration-gray-800 dark:decoration-white">Resources</NavLink>
          <div className="px-4 border-l border-r border-gray-400/50">
            <ThemeBtn />
          </div>
          <div className=" flex items-center gap-4">
            <NavLink to="/login" className="px-3 py-1 border rounded-sm">
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="px-3 py-1 bg-black border rounded-sm border-black text-white dark:bg-white dark:border-white dark:text-black"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
        <div className="flex md:hidden items-center gap-4">
          <ThemeBtn />
          <RiMenuFill size={24} onClick={() => setShowSideNav(true)} />
        </div>
      </div>
      <div
        className={`md:hidden ${
          showSideNav ? "block" : "hidden"
        } absolute top-0 w-full h-screen z-50 flex items-start justify-items-start bg-white dark:bg-gray-950`}
      >
        <div className="w-[90%] absolute top-0 left-[50%] translate-x-[-50%] flex items-center justify-between py-4">
        <a className="flex items-center gap-2" href="/">
        <Logo className="w-7" />
          <p className="text-lg font-bold"><span className="gradiant-text">Microdome</span></p>
        </a>
          <div className="flex items-center gap-4">
            <ThemeBtn />
          <RiCloseLine size={24} onClick={() => setShowSideNav(false)} />
          </div>
        </div>
        <div className="w-[90%] mx-auto mt-32 flex flex-col gap-4">
          <NavLink onClick={() => setShowSideNav(false)} to="/" className="text-lg">Home</NavLink>
          <NavLink onClick={() => setShowSideNav(false)} to="/courses" className="text-lg">Courses</NavLink>
          <NavLink onClick={() => setShowSideNav(false)} className="text-lg">About Us</NavLink>
          <NavLink onClick={() => setShowSideNav(false)} className="text-lg">Resources</NavLink>
          <NavLink onClick={() => setShowSideNav(false)}
            to="/login"
            className=" w-full py-2 text-center text-lg border rounded-sm"
          >
            Login
          </NavLink>
          <NavLink onClick={() => setShowSideNav(false)}
            to="/signup"
            className="w-full py-2 text-center text-lg bg-black border rounded-sm border-black text-white dark:text-black dark:bg-white dark:border-white"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
