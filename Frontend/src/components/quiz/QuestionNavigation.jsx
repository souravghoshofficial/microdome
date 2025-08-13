import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const QuestionNavigation = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="w-full  rounded-sm flex flex-col gap-4 p-2 border">
      <div
        onClick={() => {
          setShowMenu((prev) => !prev);
        }}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer border rounded-sm"
      >
        <div>
          <h3>Question Navigation</h3>
        </div>
        <div
          className={`text-xl cursor-pointer ${
            showMenu ? "-rotate-180" : "rotate-0"
          } transition-all duration-300 `}
        >
          <ChevronDown />
        </div>
      </div>
      <div className={`w-full ${showMenu ? "block" : "hidden"}`}>
        <div className="grid grid-cols-20 gap-4">
          {Array.from({ length: 36 }, (_, index) => (
            <div
              className="px-2 py-1 bg-zinc-800 border border-zinc-900/60 text-center rounded-sm"
              key={index}
            >
              {" "}
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;
