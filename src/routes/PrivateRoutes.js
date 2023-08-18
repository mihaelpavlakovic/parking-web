// react imports
import { useEffect, useCallback } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// store imports
import { getUserData, logout } from "../store/user/userActions";
import { getCameras } from "../store/camera/cameraActions";
import { selectIsExpired } from "../store/user/userSlice";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const isExpired = useSelector(selectIsExpired);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigateToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (token && !isExpired) {
      dispatch(getUserData()).then(() => {
        dispatch(getCameras(token));
      });
    } else if (token && isExpired) {
      console.log("Token expired. Logging out...");
      dispatch(logout()).then(() => window.location.reload());
      navigateToLogin();
    } else {
      console.log("No token provided. Redirecting to login...");
      navigateToLogin();
    }
  }, [token, isExpired, dispatch, navigateToLogin]);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
