import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/authSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
