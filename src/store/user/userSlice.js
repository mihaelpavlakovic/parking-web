import { createSlice } from "@reduxjs/toolkit";
import { getUserData, login } from "./userActions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    user: null,
    serverResponseError: false,
    serverResponseMessage: "",
    tokenRequestStatus: "idle",
    userRequestStatus: "idle",
  },
  reducers: {
    LOGIN: (state, { payload }) => {
      state.token = payload.token;
    },
    SET_USER: (state, { payload }) => {
      state.user = payload.userData;
    },
    LOGOUT: state => {
      localStorage.removeItem("token");
      state.token = null;
      state.serverResponseMessage = "";
      state.serverResponseError = false;
      state.tokenRequestStatus = "idle";
      state.userRequestStatus = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, state => {
        state.tokenRequestStatus = "loading";
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.tokenRequestStatus = "succeeded";
        localStorage.setItem("token", JSON.stringify(payload.token));
        state.token = payload.token;
        state.serverResponseMessage = payload.serverResponseMessage;
        state.serverResponseError = payload.serverResponseError;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.tokenRequestStatus = "failed";
        state.serverResponseError = payload.serverResponseMessage;
      })
      .addCase(getUserData.pending, state => {
        state.userRequestStatus = "loading";
      })
      .addCase(getUserData.fulfilled, (state, { payload }) => {
        state.userRequestStatus = "succeeded";
        state.user = payload.userData;
      })
      .addCase(getUserData.rejected, (state, { payload }) => {
        state.userRequestStatus = "failed";
        state.serverResponseError = payload.serverResponseMessage;
      });
  },
});

export const selectUser = state => state.user.user;
export const selectServerResponseError = state =>
  state.user.serverResponseError;
export const selectServerResponseMessage = state =>
  state.user.serverResponseMessage;
export const selectTokenRequestStatus = state => state.user.tokenRequestStatus;
export const selectUserRequestStatus = state => state.user.userRequestStatus;

export const { LOGIN, SET_USER, LOGOUT } = userSlice.actions;

export default userSlice.reducer;