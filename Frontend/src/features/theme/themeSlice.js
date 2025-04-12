import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: "dark",
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    darkTheme: (state) => {
      state.theme = "dark"
    },
    lightTheme: (state) => {
      state.theme = "light"
    },
  },
})


export const { darkTheme , lightTheme } = themeSlice.actions

export default themeSlice.reducer