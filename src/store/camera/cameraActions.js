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
        data: null,
        message: response.data.message,
        error: response.data.error,
      };
    }

    return {
      data: response.data.data,
      message: response.data.message,
      error: response.data.error,
    };
  }
);

export const getParkingStatus = createAsyncThunk(
  "camera/PARKING_STATUS",
  async data => {
    const { token, cameraId } = data;
    const response = await axios.get(
      `http://3.253.53.168:5050/cameras/parkingStatus?cameraId=${cameraId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.error) {
      return {
        data: null,
        message: response.data.message,
        error: response.data.error,
      };
    }

    return {
      data: response.data.data.data.spots,
      message: response.data.message,
      error: response.data.error,
    };
  }
);
