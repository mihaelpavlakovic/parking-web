import { createSlice } from "@reduxjs/toolkit";
import { getCameras } from "./cameraActions";

export const cameraSlice = createSlice({
  name: "camera",
  initialState: {
    cameraData: null,
    message: "",
    status: "idle",
    error: false,
  },
  reducers: {
    SET_CAMERA_DATA: (state, action) => {
      state.cameraData = action.payload.data;
      state.error = action.payload.error;
      state.message = action.payload.message;
    },
    REMOVE_DATA: state => {
      state.cameraData = null;
      state.message = "";
      state.status = "idle";
      state.error = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCameras.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCameras.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        state.cameraData = action.payload.data;
        state.message = action.payload.message;
        state.error = action.payload.error;
      })
      .addCase(getCameras.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { SET_CAMERA_DATA, REMOVE_DATA } = cameraSlice.actions;

export default cameraSlice.reducer;
