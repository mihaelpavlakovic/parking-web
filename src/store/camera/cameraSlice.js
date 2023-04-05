import { createSlice } from "@reduxjs/toolkit";
import { getCameras } from "./cameraActions";

export const cameraSlice = createSlice({
  name: "camera",
  initialState: {
    cameras: null,
    serverResponseError: false,
    serverResponseMessage: "",
    cameraRequestStatus: "idle",
  },
  reducers: {
    SET_CAMERA_DATA: (state, { payload }) => {
      state.cameras = payload.cameras;
      state.serverResponseError = payload.serverResponseError;
      state.serverResponseMessage = payload.serverResponseMessage;
    },
    REMOVE_DATA: state => {
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
      .addCase(getCameras.fulfilled, (state, { payload }) => {
        state.cameraRequestStatus = "succeeded";
        state.cameras = payload.cameras;
        state.serverResponseMessage = payload.serverResponseMessage;
        state.serverResponseError = payload.serverResponseError;
      })
      .addCase(getCameras.rejected, state => {
        state.cameraRequestStatus = "failed";
      });
  },
});

export const selectCameras = state => state.camera.cameras;
export const selectServerResponseMessage = state =>
  state.camera.serverResponseMessage;

export const { SET_CAMERA_DATA, REMOVE_DATA } = cameraSlice.actions;

export default cameraSlice.reducer;
