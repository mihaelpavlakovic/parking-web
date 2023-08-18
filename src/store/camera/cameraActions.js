// react imports
import { createAsyncThunk } from "@reduxjs/toolkit";
import { startUpdates, updateCameraData } from "./cameraSlice";
import {
  addEventSource,
  removeEventSource,
} from "../../services/eventSourceService";

// library imports
import { del, get, post, putReq } from "../../functions/restClient";
import { baseURL } from "../../enviroment";
var _ = require("lodash");

export const getCameras = createAsyncThunk(
  "camera/getCamera",
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
    console.log("cameraData:", cameraData);
    thunkAPI.dispatch(updateCameraData({ cameraData }));
    thunkAPI.dispatch(startCameraUpdates(cameraData));

    return cameraData;
  }
);

export const fetchCameraFrame = createAsyncThunk(
  "camera/fetchCameraFrame",
  async ({ cameraId }, thunkAPI) => {
    const response = await get(`cameras/originalImage?cameraId=${cameraId}`);

    if (response.error) {
      return {
        cameraFrame: null,
        cameraId,
        serverResponseMessage: response.message,
        serverResponseError: response.error,
      };
    }

    return {
      cameraFrame: response.data,
      cameraId,
      serverResponseMessage: response.message,
      serverResponseError: response.error,
    };
  }
);

export const fetchStreamPicture = createAsyncThunk(
  "camera/fetchStreamPicture",
  async ({ streamUrl, basicAuth }, thunkAPI) => {
    const encodedStreamUrl = encodeURIComponent(window.btoa(streamUrl));
    const encodedUserId = encodeURIComponent(basicAuth);

    const response = await get(
      `${baseURL}cameras/fetchFrame?sourceUrl=${encodedStreamUrl}&basicAuth=${encodedUserId}`
    );
    const { data, message, error } = response;

    if (error) {
      return {
        streamPicture: "",
        serverResponseMessage: message,
        serverResponseError: error,
      };
    }
    return {
      streamPicture: data,
      serverResponseMessage: message,
      serverResponseError: error,
    };
  }
);

export const startCameraUpdates = createAsyncThunk(
  "camera/startUpdates",
  async (cameras, thunkAPI) => {
    _.forEach(cameras.data, camera => {
      const handleCameraUpdate = camera => {
        if (camera.cameraId !== null) {
          thunkAPI.dispatch(fetchCameraFrame({ cameraId: camera.cameraId }));
          thunkAPI.dispatch(startUpdates({ camera }));
        }
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
  async ({ name, sourceURL, parkingSpaces, basicAuth }, thunkAPI) => {
    const userId = thunkAPI.getState().user.user.id;
    const response = await post("cameras/create", {
      sourceURL,
      name,
      parkingSpaces,
      userId,
      basicAuth,
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

export const updateCamera = createAsyncThunk(
  "camera/updateCamera",
  async ({ id, name, sourceURL, parkingSpaces }, thunkAPI) => {
    const userId = thunkAPI.getState().user.user.id;
    const response = await putReq("cameras/update", {
      id,
      sourceURL,
      name,
      parkingSpaces,
      userId,
    });
    if (response.error) {
      return {
        camera: null,
        serverResponseMessage: response.message,
        serverResponseError: response.error,
      };
    }

    return {
      camera: response.data[1],
      serverResponseMessage: response.message,
      serverResponseError: response.error,
    };
  }
);

export const removeCamera = createAsyncThunk(
  "camera/removeCamera",
  async cameraId => {
    console.log("cameraId:", cameraId);
    removeEventSource(cameraId);
    const response = await del(`cameras/remove?cameraId=${cameraId}`);

    if (response.error) {
      return {
        token: null,
        serverResponseMessage: response.message,
        serverResponseError: response.error,
      };
    }

    return {
      cameraId,
      token: response.data,
      serverResponseMessage: response.message,
      serverResponseError: response.error,
    };
  }
);
