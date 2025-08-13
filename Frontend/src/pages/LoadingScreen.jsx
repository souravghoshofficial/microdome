import React from "react";
import { Logo } from "../components";

const LoadingScreen = () => {
  return (
    <div className="w-full h-screen bg-black flex flex-col justify-between items-center">
      {/* Empty space at top */}
      <div></div>

      {/* Logo in center */}
      <div>
        <Logo className={"w-40 md:w-52 lg:w-64"} />
      </div>

      {/* Spinner near bottom */}
      <div className="mb-10">
        <div className="w-8 h-8 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;

