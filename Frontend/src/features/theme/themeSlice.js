import { createSlice } from "@reduxjs/toolkit";

let value = null;
const localTheme = localStorage.getItem("theme");

if (localTheme) {
  value = localTheme;
} else {
  const systemDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (systemDarkTheme) value = "dark";
  else value = "light";
}

const initialState = {
  theme: value,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    darkTheme: (state) => {
      state.theme = "dark";
    },
    lightTheme: (state) => {
      state.theme = "light";
    },
  },
});

export const { darkTheme, lightTheme } = themeSlice.actions;

export default themeSlice.reducer;
