import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { darkTheme, lightTheme } from "../features/theme/themeSlice";

export default function ThemeBtn({className}) {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(theme);
  }, [theme]);

  const changeTheme = (e) => {
    const darkThemeStatus = e.currentTarget.checked;
    if (darkThemeStatus) {
      dispatch(darkTheme());
    } else {
      dispatch(lightTheme());
    }
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        onChange={changeTheme}
        checked={theme === "dark"}
        className="sr-only peer"
      />
      <div className={`${className} bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-400 hover:border-blue-500 peer-focus:outline-none  rounded-full after:content-[url(./assets/sun.svg)] peer-checked:after:content-[url(./assets/moon.svg)] after:shadow-xl peer-checked:after:translate-x-full after:absolute after:left-[2px]  after:rounded-full  after:transition-all after:duration-300 transition-all duration-300`}></div>
    </label>
  );
}
