import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/authSlice";
import cameraReducer from "./camera/cameraSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    camera: cameraReducer,
  },
});
