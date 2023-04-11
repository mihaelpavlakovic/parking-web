// react imports
import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserData } from "../store/user/userActions";
import { getCameras } from "../store/camera/cameraActions";
import { LOGOUT } from "../store/user/userSlice";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getUserData(token));
      dispatch(getCameras(token));
    } else {
      dispatch(LOGOUT());
    }
  }, [token, dispatch]);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
