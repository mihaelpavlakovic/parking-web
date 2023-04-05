// react imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// library imports
import axios from "axios";

export const getCameras = createAsyncThunk(
  "camera/SET_CAMERA_DATA",
  async token => {
    const response = await axios.get(
      "http://3.253.53.168:5050/rest-api/v1/cameras",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.error) {
      return {
        cameras: null,
        serverResponseMessage: response.data.message,
        serverResponseError: response.data.error,
      };
    }

    return {
      cameras: response.data.data,
      serverResponseMessage: response.data.message,
      serverResponseError: response.data.error,
    };
  }
);
