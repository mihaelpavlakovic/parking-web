import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import cameraReducer from "./camera/cameraSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    camera: cameraReducer,
  },
});
