import React from "react";

const Button = ({ btnText, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium cursor-pointer hover:-translate-y-1 transition-all duration-200 ${className}`}
    >
      {btnText}
    </button>
  );
};

export default Button;
