import { createSlice } from "@reduxjs/toolkit";
import { getUserData, login } from "./userActions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    user: null,
    message: "",
    status: "idle",
    getUserStatus: "idle",
    error: false,
  },
  reducers: {
    LOGIN: (state, action) => {
      state.token = action.payload.userToken;
    },
    SET_USER: (state, action) => {
      state.user = action.payload.userData;
    },
    LOGOUT: state => {
      localStorage.removeItem("token");
      state.token = null;
      state.message = "";
      state.error = false;
      state.status = "idle";
      state.getUserStatus = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        localStorage.setItem("token", JSON.stringify(action.payload.userToken));
        state.token = action.payload.userToken;
        state.message = action.payload.message;
        state.error = action.payload.error;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getUserData.pending, (state, action) => {
        state.getUserStatus = "loading";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.getUserStatus = "succeeded";
        // Add any fetched posts to the array
        state.user = action.payload.userData;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.getUserStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { LOGIN, LOGOUT } = userSlice.actions;

export default userSlice.reducer;
