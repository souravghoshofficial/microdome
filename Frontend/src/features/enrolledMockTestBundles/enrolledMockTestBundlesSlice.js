import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  MockTestBundleDetails: null
}

const enrolledMockTestBundlesSlice = createSlice({
  name: 'enrolledMockTestBundles',
  initialState,
  reducers: {
    addBundles: (state,action) => {
      state.MockTestBundleDetails=action.payload
    },
    removeBundles: (state) => {
      state.MockTestBundleDetails=null
    }
  }
})

export const {addBundles,removeBundles} = enrolledMockTestBundlesSlice.actions;

export default enrolledMockTestBundlesSlice.reducer;