// react imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// library imports
import axios from "axios";

export const login = createAsyncThunk(
  "users/LOGIN",
  async ({ email, password }) => {
    const response = await axios.post(
      "http://3.253.53.168:5050/rest-api/v1/users/login",
      {
        email: email,
        password: password,
      }
    );

    if (response.data.error) {
      return {
        userToken: null,
        message: response.data.message,
        error: response.data.error,
      };
    }

    return {
      userToken: response.data.data.token,
      message: response.data.message,
      error: response.data.error,
    };
  }
);

export const getUserData = createAsyncThunk("users/SET_USER", async token => {
  const response = await axios.get(
    "http://3.253.53.168:5050/rest-api/v1/users/current",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // if(response.data.error) return
  return { userData: response.data.data };
});
