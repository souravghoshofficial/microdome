import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { darkTheme , lightTheme } from "../features/theme/themeSlice";


export default function ThemeBtn() {

  const dispatch = useDispatch()
  useEffect(() => {
      const localTheme = localStorage.getItem("theme");    
      if(!localTheme){
        const systemDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if(systemDarkTheme){
          dispatch(darkTheme());
        }
        else{
          dispatch(lightTheme());
        }
      }
      else{
        if(localTheme === "dark") dispatch(darkTheme());
        else dispatch(lightTheme());
      }
      
  }, [])

  const theme = useSelector(state => state.theme.theme)

  useEffect(() => {
    localStorage.setItem("theme" , theme);
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
      <div className="w-11 h-6 border border-gray-700 dark:border-gray-300 hover:border-blue-500 bg-[url(./assets/morning-sky.jpeg)] bg-cover bg-center peer-focus:outline-none  rounded-full peer-checked:bg-[url(./assets/night-sky.jpeg)] after:bg-[#FED32E] peer-checked:after:bg-[#D1D8E0] after:border after:border-yellow-500 peer-checked:after:border-white  after:shadow-xl peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px]  after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
  );
}
