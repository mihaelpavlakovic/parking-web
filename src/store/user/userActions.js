// react imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// library imports
import { del, get, post } from "../../functions/restClient";

export const login = createAsyncThunk(
  "user/LOGIN",
  async ({ email, password }) => {
    const response = await post("users/login", {
      email: email,
      password: password,
    });

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

export const register = createAsyncThunk(
  "user/REGISTER",
  async ({ email, password }) => {
    const response = await post("users/register", {
      email: email,
      password: password,
      role: "ADMIN",
    });

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

export const deleteUser = createAsyncThunk(
  "user/DELETE_USER",
  async (_, thunkAPI) => {
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
  }
);

export const getUserData = createAsyncThunk("users/SET_USER", async _ => {
  const response = await get("users/current");

  return { userData: response.data };
});
