// react imports
import { createAsyncThunk } from "@reduxjs/toolkit";
import { startUpdates, updateCamera } from "./cameraSlice";
import { addEventSource } from "../../services/eventSourceService";

// library imports
import { get } from "../../functions/restClient";
import { baseURL } from "../../enviroment";
var _ = require("lodash");

export const getCameras = createAsyncThunk(
  "camera/updateCamera",
  async (__, thunkAPI) => {
    const response = await get("cameras");

    let cameraData = response;
    const user = thunkAPI.getState().user.user;

    if (cameraData.error) {
      return cameraData;
    }
    let currentUserCameras = _.filter(cameraData.data, { userId: user.id });
    cameraData = { ...cameraData, data: currentUserCameras };

    thunkAPI.dispatch(updateCamera({ cameraData }));
    thunkAPI.dispatch(startCameraUpdates(cameraData));
    return cameraData;
  }
);

export const startCameraUpdates = createAsyncThunk(
  "camera/startUpdates",
  async (cameras, thunkAPI) => {
    _.forEach(cameras.data, camera => {
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
        `${baseURL}cameras/stream?cameraId=${camera.id}`,
        handleCameraUpdate,
        handleEventSourceOpen,
        handleEventSourceError
      );
    });
  }
);
