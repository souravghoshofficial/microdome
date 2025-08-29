import React, { useId } from "react";

const Option = ({ option, selected, onSelect }) => {
  const id = useId();

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer border transition-colors duration-200
        ${
          selected
            ? ""
            : "bg-white border-gray-300 hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700"
        }`}
      onClick={onSelect}
    >
      <input
        type="radio"
        id={id}
        checked={selected}
        onChange={onSelect}
        className="cursor-pointer accent-sky-500"
      />
      <label
        htmlFor={id}
        className="cursor-pointer w-full text-gray-900 dark:text-gray-100"
      >
        {option}
      </label>
    </div>
  );
};

export default Option;
