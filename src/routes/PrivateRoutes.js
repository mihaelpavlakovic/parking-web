// react imports
import { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, logout } from "../store/user/userActions";
import { getCameras } from "../store/camera/cameraActions";
import { selectIsExpired } from "../store/user/userSlice";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const isExpired = useSelector(selectIsExpired);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      if (isExpired) {
        dispatch(logout());
        navigate("/login");
      } else {
        dispatch(getUserData());
        dispatch(getCameras(token));
      }
    } else {
      dispatch(logout());
      navigate("/login");
    }
  }, [token, isExpired, dispatch, navigate]);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
