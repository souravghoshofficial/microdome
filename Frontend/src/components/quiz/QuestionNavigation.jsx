import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const QuestionNavigation = ({ total, current, onJump, answers }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="w-full rounded-md flex flex-col gap-4 p-2 border border-gray-300 dark:border-zinc-700">
      {/* Header */}
      <div
        onClick={() => setShowMenu((prev) => !prev)}
        className="w-full flex items-center justify-between px-6 py-3 cursor-pointer border rounded-md 
        bg-gray-100 border-gray-300 text-gray-900 
        dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
      >
        <h3 className="font-semibold">Question Navigation</h3>
        <div
          className={`text-xl transition-transform duration-300 ${
            showMenu ? "-rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown />
        </div>
      </div>

      {/* Navigation Grid */}
      {showMenu && (
        <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-2 px-2">
          {Array.from({ length: total }, (_, index) => {
            const isCurrent = current === index;
            const isAttempted = answers.hasOwnProperty(index);

            return (
              <div
                key={index}
                onClick={() => onJump(index)}
                className={`px-3 py-2 text-sm font-medium text-center rounded-md cursor-pointer transition-colors
                  ${
                    isCurrent
                      ? "bg-green-600 text-white"
                      : isAttempted
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white"
                  }`}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestionNavigation;
