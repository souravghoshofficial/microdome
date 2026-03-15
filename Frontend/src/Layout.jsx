import { useState } from "react";
import "./index.css";
import { Outlet } from "react-router";
import { Navbar, Footer } from "./components";
import { RiWhatsappLine, RiCloseLargeLine } from "@remixicon/react";

const Layout = () => {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="w-full min-h-screen relative bg-white dark:bg-gray-950 text-black dark:text-white transition-colors duration-300">
      <Navbar />
      <Outlet />
      <Footer />

      {/* Animated WhatsApp Box */}
      <div
        className={`fixed z-20 bottom-20 md:bottom-24 right-4 md:right-8 w-80 md:w-90 p-5 rounded-xl border border-gray-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900/70 backdrop-blur-xl shadow-xl text-black dark:text-white transform transition-all duration-500 ease-in-out ${
          showMessage
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        <h4 className="text-lg font-semibold mb-1">
          Join Our WhatsApp Community
        </h4>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Get important updates about :
        </p>

        <ul className="text-sm space-y-1 mb-3 text-gray-700 dark:text-gray-300">
          <li>• Biology entrance exam updates</li>
          <li>• PhD & job opportunities</li>
          <li>• Workshops & seminars</li>
          <li>• Important academic notifications</li>
        </ul>

        <a
          href="https://chat.whatsapp.com/LepMbONA6YlF95IGOITe8h"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-center font-semibold transition-colors"
        >
          <RiWhatsappLine className="size-5" />
          Join WhatsApp Group
        </a>
      </div>

      {/* Toggle Button */}
      <div
        onClick={() => setShowMessage((prev) => !prev)}
        className="h-12 z-10 md:h-14 bg-[#2DD54D] rounded-full fixed bottom-5 right-5 md:right-8 text-white flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
      >
        {/* WhatsApp Icon (when hidden) */}
        <div
          className={`flex items-center gap-2 p-2 ${
            showMessage ? "hidden" : "block"
          } w-12 md:w-auto`}
        >
          <RiWhatsappLine className="size-8 md:size-10" />
        </div>

        {/* Close Icon (when visible) */}
        <div
          className={`w-12 md:w-14 ${
            showMessage ? "block" : "hidden"
          } flex items-center justify-center`}
        >
          <RiCloseLargeLine className="size-5 md:size-6" />
        </div>
      </div>
    </div>
  );
};

export default Layout;
