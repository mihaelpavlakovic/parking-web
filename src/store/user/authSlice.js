import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    LOGIN: state => {
      state.user = "User";
    },
  },
});

// Action creators are generated for each case reducer function
export const { LOGIN } = userSlice.actions;

export default userSlice.reducer;
