// react imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// library imports
import { del, get, post } from "../../functions/restClient";

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    console.log("email:", email);
    const response = await post("users/login", {
      email: email,
      password: password,
    });
    console.log("response:", response);

    if (response.error) {
      return {
        token: null,
        serverResponseMessage: response.message,
        serverResponseError: response.error,
      };
    }

    return {
      token: response.data,
      serverResponseMessage: response.message,
      serverResponseError: response.error,
    };
  }
);

export const logout = createAsyncThunk("user/logout", () => {
  console.log("logout");
  return [];
});

export const register = createAsyncThunk(
  "user/register",
  async ({ email, password }) => {
    const response = await post("users/register", {
      email: email,
      password: password,
      role: "ADMIN",
    });
    console.log("response:", response);

    if (response.error) {
      return {
        token: null,
        serverResponseMessage: response.message,
        serverResponseError: response.error,
      };
    }

    return {
      token: response.data,
      serverResponseMessage: response.message,
      serverResponseError: response.error,
    };
  }
);

export const deleteUser = createAsyncThunk("user/deleteUser", async _ => {
  const response = await del("users/remove");

  if (response.error) {
    return {
      token: null,
      serverResponseMessage: response.message,
      serverResponseError: response.error,
    };
  }

  return {
    token: response.data,
    serverResponseMessage: response.message,
    serverResponseError: response.error,
  };
});

export const getUserData = createAsyncThunk(
  "user/getUserData",
  async (_, { dispatch }) => {
    const response = await get("users/current");
    console.log("response:", response);

    if (response.error) {
      if (
        response.message.toLowerCase() === "jwt expired" ||
        response.message.toLowerCase() === "invalid signature"
      ) {
        dispatch(logout());
        return { userData: null, isExpired: true };
      }
    }

    return { userData: response.data, isExpired: false };
  }
);
