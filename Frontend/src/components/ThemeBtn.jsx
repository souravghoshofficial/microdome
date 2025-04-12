import React, { useEffect, useState } from "react";

export default function ThemeBtn() {
  const [theme, setTheme] = useState("dark");

  const changeTheme = (e) => {
    const darkThemeStatus = e.currentTarget.checked;
    if (darkThemeStatus) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(theme);
  }, [theme]);

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        onChange={changeTheme}
        checked={theme === "dark"}
        className="sr-only peer"
      />
      <div className="w-11 h-6 border-1 border-gray-300 hover:border-blue-500 bg-[url(./assets/morning-sky.jpeg)] bg-cover bg-center peer-focus:outline-none  rounded-full peer-checked:bg-[url(./assets/night-sky.jpeg)] after:bg-[#FED32E] peer-checked:after:bg-[#D1D8E0] after:shadow-xl peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px]  after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
  );
}
