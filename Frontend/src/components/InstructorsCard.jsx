import React from "react";

export default function InstructorsCard({ image, name, subject, description }) {
  return (
    <div className="dark:bg-black dark:border  bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow display">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
      />
      <h3 className="dark:text-white text-xl font-bold text-gray-800">{name}</h3>
      <p className="dark:text-white text-indigo-600 font-semibold">{subject}</p>
      <p className="dark:text-white text-gray-600 mt-3 text-sm">{description}</p>
    </div>
  );
}
