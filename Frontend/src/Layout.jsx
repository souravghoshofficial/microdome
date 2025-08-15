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
        className={`fixed z-10 bottom-20 md:bottom-24 w-[85%] md:w-[25%] right-5 md:right-8 p-4 md:p-5 rounded-sm border border-gray-200 dark:border-gray-50/[.1] bg-white dark:bg-zinc-900 text-black dark:text-white transform transition-all duration-500 ease-in-out ${
          showMessage
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        <h4 className="text-lg font-bold">Let's Connect</h4>
        <p className="text-sm">
          Join our free WhatsApp group and become a part of our extended family.
          This group is solely for updating group members about the biological
          sciences field, notifications related to jobs, workshops, seminars,
          PhD vacancies, exams etc.
        </p>
        <a
          href="https://chat.whatsapp.com/LepMbONA6YlF95IGOITe8h"
          target="_blank"
          className="mt-2 md:mt-4 inline-block rounded-sm w-full py-2 bg-highlighted hover:bg-highlighted-hover text-white text-center font-semibold cursor-pointer"
        >
          Join Now
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
