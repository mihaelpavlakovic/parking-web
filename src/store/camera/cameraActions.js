// react imports
import { createAsyncThunk } from "@reduxjs/toolkit";
import { startUpdates, updateCamera } from "./cameraSlice";
import { addEventSource } from "../../services/eventSourceService";

// library imports
import axios from "axios";
var _ = require("lodash");

export const getCameras = createAsyncThunk(
  "camera/updateCamera",
  async (token, thunkAPI) => {
    const response = await axios.get(
      "http://3.253.53.168:5050/rest-api/v1/cameras",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    let cameraData = response.data;
    const user = thunkAPI.getState().user.user;

    if (cameraData.error) {
      return cameraData;
    }
    const currentUserCameras = _.filter(cameraData.data, { userId: user?.id });
    cameraData = { ...cameraData, data: currentUserCameras };

    thunkAPI.dispatch(updateCamera({ cameraData }));
    return cameraData;
  }
);

export const startCameraUpdates = createAsyncThunk(
  "camera/startUpdates",
  async (cameras, thunkAPI) => {
    _.forEach(cameras, camera => {
      const handleCameraUpdate = camera => {
        thunkAPI.dispatch(startUpdates({ camera }));
      };

      function handleEventSourceOpen(event) {
        console.log("Connection opened");
      }

      function handleEventSourceError(event) {
        console.log("Error occurred");
      }

      addEventSource(
        camera.id,
        `http://3.253.53.168:5050/rest-api/v1/stream?cameraId=${camera.id}`,
        handleCameraUpdate,
        handleEventSourceOpen,
        handleEventSourceError
      );
    });
  }
);
