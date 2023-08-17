import { createSlice } from "@reduxjs/toolkit";
import {
  deleteUser,
  getUserData,
  login,
  logout,
  register,
} from "./userActions";
import { setHeaders } from "../../functions/restClient";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    isExpired: false,
    user: null,
    serverResponseError: false,
    serverResponseMessage: "",
    tokenRequestStatus: "idle",
    userRequestStatus: "idle",
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.tokenRequestStatus = "loading";
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.tokenRequestStatus = "succeeded";
        setHeaders(payload.token?.token);
        state.serverResponseMessage = payload.serverResponseMessage;
        state.serverResponseError = payload.serverResponseError;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.tokenRequestStatus = "failed";
      })
      .addCase(logout.pending, (state) => {
        state.tokenRequestStatus = "loading";
      })
      .addCase(logout.fulfilled, (state, { payload }) => {
        localStorage.removeItem("token");
        state.token = null;
        state.user = null;
        state.isExpired = false;
        state.serverResponseMessage = "";
        state.serverResponseError = false;
        state.tokenRequestStatus = "idle";
        state.userRequestStatus = "idle";
      })
      .addCase(logout.rejected, (state, { payload }) => {
        state.tokenRequestStatus = "failed";
      })
      .addCase(register.pending, (state) => {
        state.tokenRequestStatus = "loading";
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.tokenRequestStatus = "succeeded";
        state.serverResponseMessage = payload.serverResponseMessage;
        state.serverResponseError = payload.serverResponseError;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.tokenRequestStatus = "failed";
      })
      .addCase(deleteUser.pending, (state) => {
        state.tokenRequestStatus = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.tokenRequestStatus = "succeeded";
        state.serverResponseMessage = payload.serverResponseMessage;
        state.serverResponseError = payload.serverResponseError;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.tokenRequestStatus = "failed";
      })
      .addCase(getUserData.pending, (state) => {
        state.userRequestStatus = "loading";
      })
      .addCase(getUserData.fulfilled, (state, { payload }) => {
        const { userData, isExpired } = payload;
        if (isExpired) {
          state.isExpired = isExpired;
          state.user = userData;
        } else {
          state.user = payload.userData;
          state.isExpired = isExpired;
        }
        state.userRequestStatus = "succeeded";
      })
      .addCase(getUserData.rejected, (state) => {
        state.userRequestStatus = "failed";
      });
  },
});

export const selectUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;
export const selectIsExpired = (state) => state.user.isExpired;
export const selectServerResponseError = (state) =>
  state.user.serverResponseError;
export const selectServerResponseMessage = (state) =>
  state.user.serverResponseMessage;
export const selectTokenRequestStatus = (state) =>
  state.user.tokenRequestStatus;
export const selectUserRequestStatus = (state) => state.user.userRequestStatus;

export default userSlice.reducer;
