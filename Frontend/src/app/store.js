import { configureStore } from '@reduxjs/toolkit'
import themeSlice from '../features/theme/themeSlice'
import authSlice from "../features/auth/authSlice"
import profileCardSlice from "../features/profileCard/profileCardSlice"

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    profileCard: profileCardSlice,
  },
})