import { createSlice } from "@reduxjs/toolkit";
import { addCamera, getCameras } from "./cameraActions";
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
      } else if (cameraData.lenght === 0) {
        state.cameras = [];
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
      console.log("payload.camera:", payload.camera);
      const { cameraId, occupancy, timestamp } = payload.camera;
      console.log(
        "cameraId, occupancy, timestamp:",
        cameraId,
        occupancy,
        timestamp
      );
      state.cameras[cameraId] = {
        ...state.cameras[cameraId],
        ...occupancy,
        timestamp,
      };
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
      })
      .addCase(addCamera.pending, state => {
        state.cameraRequestStatus = "loading";
      })
      .addCase(addCamera.fulfilled, state => {
        state.cameraRequestStatus = "succeeded";
      })
      .addCase(addCamera.rejected, state => {
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
