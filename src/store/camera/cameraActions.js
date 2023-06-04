// react imports
import { createAsyncThunk } from "@reduxjs/toolkit";
import { startUpdates, updateCamera } from "./cameraSlice";
import { addEventSource } from "../../services/eventSourceService";

// library imports
import { get, post } from "../../functions/restClient";
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

    if (currentUserCameras.length === 0) {
      cameraData = [];
      return cameraData;
    }

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

export const addCamera = createAsyncThunk(
  "camera/addCamera",
  async ({ name, sourceURL, parkingSpaces }, thunkAPI) => {
    const userId = thunkAPI.getState().user.user.id;
    console.log("userId:", userId);
    const response = await post("cameras/create", {
      sourceURL,
      name,
      parkingSpaces,
      userId,
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
