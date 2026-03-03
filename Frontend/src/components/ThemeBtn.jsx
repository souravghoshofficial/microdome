// ThemeBtn.jsx
import { Sun, Moon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { darkTheme, lightTheme } from "../features/theme/themeSlice";
import { useEffect } from "react";

export default function ThemeBtn() {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "dark") {
      dispatch(lightTheme());
    } else {
      dispatch(darkTheme());
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 flex items-center justify-center rounded-full
                 bg-gray-100 dark:bg-zinc-800
                 hover:bg-gray-200 dark:hover:bg-zinc-700
                 transition cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}