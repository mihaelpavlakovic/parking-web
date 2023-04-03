import { createSlice } from "@reduxjs/toolkit";
import { getCameras, getParkingStatus } from "./cameraActions";

export const cameraSlice = createSlice({
  name: "camera",
  initialState: {
    cameraData: null,
    parkingStatus: null,
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
    PARKING_STATUS: (state, action) => {
      state.parkingStatus = action.payload.data;
    },
    REMOVE_DATA: state => {
      state.cameraData = null;
      state.parkingStatus = null;
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
        state.cameraData = action.payload.data;
        state.message = action.payload.message;
        state.error = action.payload.error;
      })
      .addCase(getCameras.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getParkingStatus.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getParkingStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parkingStatus = action.payload.data;
        state.message = action.payload.message;
        state.error = action.payload.error;
      })
      .addCase(getParkingStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { SET_CAMERA_DATA, REMOVE_DATA } = cameraSlice.actions;

export default cameraSlice.reducer;
