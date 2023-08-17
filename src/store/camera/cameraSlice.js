import { createSlice } from "@reduxjs/toolkit";
import {
  addCamera,
  fetchCameraFrame,
  fetchStreamPicture,
  getCameras,
  removeCamera,
  updateCamera,
} from "./cameraActions";
import { removeEventSource } from "../../services/eventSourceService";
var _ = require("lodash");

export const cameraSlice = createSlice({
  name: "camera",
  initialState: {
    cameras: [],
    streamPicture: "",
    serverResponseError: false,
    serverResponseMessage: "",
    cameraRequestStatus: "idle",
    fetchStreamResponseError: false,
    fetchStreamPictureError: "",
    fetchStreamPictureStatus: "idle",
  },
  reducers: {
    updateCameraData: (state, { payload }) => {
      const { cameraData } = payload;
      if (cameraData.error) {
        state.cameras = [];
        state.serverResponseError = cameraData.error;
        state.serverResponseMessage = cameraData.message;
      } else if (cameraData.lenght === 0) {
        state.cameras = [];
      } else {
        const camerasArr = cameraData.data.map((camera) => camera);
        state.cameras = camerasArr;
        state.serverResponseError = cameraData.error;
        state.serverResponseMessage = cameraData.message;
      }
    },
    startUpdates: (state, { payload }) => {
      const { cameraId, occupancy, timestamp } = payload.camera;

      const cameraToUpdate = state.cameras.find(
        (camera) => camera.id === cameraId
      );
      if (cameraToUpdate) {
        Object.assign(cameraToUpdate, occupancy, { timestamp });
      }
    },
    dismissFetchStreamPictureError: (state) => {
      state.fetchStreamResponseError = false;
      state.fetchStreamPictureError = "";
    },
    removeFetchedStreamPicture: (state) => {
      state.streamPicture = "";
    },
    removeStateCameraData: (state) => {
      _.forEach(JSON.parse(JSON.stringify(state.cameras)), (camera) => {
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
      .addCase(getCameras.pending, (state) => {
        state.cameraRequestStatus = "loading";
      })
      .addCase(getCameras.fulfilled, (state) => {
        state.cameraRequestStatus = "succeeded";
      })
      .addCase(getCameras.rejected, (state) => {
        state.cameraRequestStatus = "failed";
      })
      .addCase(fetchCameraFrame.pending, (state) => {
        state.cameraRequestStatus = "loading";
      })
      .addCase(fetchCameraFrame.fulfilled, (state, { payload }) => {
        const {
          cameraFrame,
          cameraId,
          serverResponseMessage,
          serverResponseError,
        } = payload;

        if (cameraFrame !== null) {
          const cameraIndex = state.cameras.findIndex(
            (camera) => camera.id === cameraId
          );

          if (cameraIndex !== -1) {
            const updatedCameras = [...state.cameras];
            const existingCamera = updatedCameras[cameraIndex];

            if (cameraFrame.hasOwnProperty("originalImage")) {
              existingCamera.originalImage = cameraFrame.originalImage;
            } else {
              existingCamera.originalImage = cameraFrame;
            }

            state.cameras = updatedCameras;
          } else {
            console.error(`Camera with cameraId ${cameraId} not found.`);
          }
        } else {
          state.serverResponseError = serverResponseError;
          state.serverResponseMessage = serverResponseMessage;
        }

        state.cameraRequestStatus = "succeeded";
      })
      .addCase(fetchCameraFrame.rejected, (state) => {
        state.cameraRequestStatus = "failed";
      })
      .addCase(fetchStreamPicture.pending, (state) => {
        state.fetchStreamPictureStatus = "loading";
      })
      .addCase(fetchStreamPicture.fulfilled, (state, { payload }) => {
        const { streamPicture, serverResponseMessage, serverResponseError } =
          payload;
        if (serverResponseError) {
          state.streamPicture = "";
          state.fetchStreamPictureError = serverResponseMessage;
          state.fetchStreamResponseError = serverResponseError;
        } else {
          state.streamPicture = streamPicture;
          state.fetchStreamPictureError = serverResponseMessage;
          state.fetchStreamResponseError = serverResponseError;
        }
        state.fetchStreamPictureStatus = "succeeded";
      })
      .addCase(fetchStreamPicture.rejected, (state) => {
        state.fetchStreamPictureStatus = "failed";
      })
      .addCase(addCamera.pending, (state) => {
        state.cameraRequestStatus = "loading";
      })
      .addCase(addCamera.fulfilled, (state) => {
        state.streamPicture = "";
        state.cameraRequestStatus = "succeeded";
      })
      .addCase(addCamera.rejected, (state) => {
        state.cameraRequestStatus = "failed";
      })
      .addCase(updateCamera.pending, (state) => {
        state.cameraRequestStatus = "loading";
      })
      .addCase(updateCamera.fulfilled, (state, { payload }) => {
        const updatedCamera = payload.camera[0];
        state.cameras = state.cameras.map((camera) => {
          if (camera.id === updatedCamera.id) {
            return {
              ...camera,
              ...updatedCamera,
            };
          }
          return camera;
        });
        state.cameraRequestStatus = "succeeded";
      })
      .addCase(updateCamera.rejected, (state) => {
        state.cameraRequestStatus = "failed";
      })
      .addCase(removeCamera.pending, (state) => {
        state.cameraRequestStatus = "loading";
      })
      .addCase(removeCamera.fulfilled, (state, { payload }) => {
        state.cameras = state.cameras.filter(
          (camera) => camera.id !== payload.cameraId
        );
        state.cameraRequestStatus = "succeeded";
        console.log("succeeded");
      })
      .addCase(removeCamera.rejected, (state) => {
        state.cameraRequestStatus = "failed";
      });
  },
});

export const selectCameras = (state) => state.camera.cameras;
export const selectCameraRequestStatus = (state) =>
  state.camera.cameraRequestStatus;
export const selectStreamPicture = (state) => state.camera.streamPicture;
export const selectFetchStreamResponseError = (state) =>
  state.camera.fetchStreamResponseError;
export const selectServerResponseError = (state) =>
  state.camera.serverResponseError;
export const selectServerResponseMessage = (state) =>
  state.camera.serverResponseMessage;
export const selectFetchStreamPictureError = (state) =>
  state.camera.fetchStreamPictureError;
export const selectFetchStreamPictureStatus = (state) =>
  state.camera.fetchStreamPictureStatus;

export const {
  updateCameraData,
  startUpdates,
  dismissFetchStreamPictureError,
  removeFetchedStreamPicture,
  removeStateCameraData,
} = cameraSlice.actions;

export default cameraSlice.reducer;
