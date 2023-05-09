import { createSlice } from "@reduxjs/toolkit";
import { getCameras } from "./cameraActions";
import { removeEventSource } from "../../services/eventSourceService";
var _ = require("lodash");

export const cameraSlice = createSlice({
  name: "camera",
  initialState: {
    cameras: [],
    serverResponseError: false,
    serverResponseMessage: "",
    cameraRequestStatus: "idle",
  },
  reducers: {
    updateCamera: (state, { payload }) => {
      const { cameraData } = payload;
      if (cameraData.error) {
        state.cameras = [];
        state.serverResponseError = cameraData.error;
        state.serverResponseMessage = cameraData.message;
      } else {
        const camerasObj = cameraData.data.reduce((obj, camera) => {
          obj[camera.id] = camera;
          return obj;
        }, {});
        state.cameras = camerasObj;
        state.serverResponseError = cameraData.error;
        state.serverResponseMessage = cameraData.message;
      }
    },
    startUpdates: (state, { payload }) => {
      const { cameraId, occupancy } = payload.camera;
      state.cameras[cameraId] = { ...state.cameras[cameraId], ...occupancy };
    },
    SET_CAMERA_DATA: (state, { payload }) => {
      state.cameras = payload.cameras;
      state.serverResponseError = payload.serverResponseError;
      state.serverResponseMessage = payload.serverResponseMessage;
    },
    REMOVE_DATA: state => {
      _.forEach(JSON.parse(JSON.stringify(state.cameras)), camera => {
        removeEventSource(camera.id);
      });
      state.cameras = null;
      state.serverResponseError = false;
      state.serverResponseMessage = "";
      state.cameraRequestStatus = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCameras.pending, state => {
        state.cameraRequestStatus = "loading";
      })
      .addCase(getCameras.fulfilled, state => {
        state.cameraRequestStatus = "succeeded";
      })
      .addCase(getCameras.rejected, state => {
        state.cameraRequestStatus = "failed";
      });
  },
});

export const selectCameras = state => state.camera.cameras;
export const selectServerResponseMessage = state =>
  state.camera.serverResponseMessage;

export const { updateCamera, startUpdates, SET_CAMERA_DATA, REMOVE_DATA } =
  cameraSlice.actions;

export default cameraSlice.reducer;
