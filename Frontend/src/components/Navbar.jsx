import React from "react";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-center z-50 backdrop-blur-md">
      <div className="w-[90%] py-4 flex items-center justify-between">
        <div>
          <a className="text-lg font-bold" href="#">MicroDome</a>
        </div>
        <div className="flex items-center gap-8">
          <a>Home</a>
          <a>Courses</a>
          <a>About Us</a>
          <a>Resources</a>
          <div className=" flex items-center gap-3">
            <a href="#" className="px-3 py-1.5 border border-black">
              Login
            </a>
            <a
              href="#"
              className="px-3 py-1.5 bg-black border border-black text-white"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
