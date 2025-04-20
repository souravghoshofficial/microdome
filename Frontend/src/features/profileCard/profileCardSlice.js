import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   show: false,
}

const profileCardSlice = createSlice({
    name: "profileCard",
    initialState,
    reducers: {
        toogleCard: (state) => {
            state.show = !state.show;
        },
        hideCard: (state) => {
            state.show = false;
        }
     }
})

export const {toogleCard, hideCard} = profileCardSlice.actions;

export default profileCardSlice.reducer;