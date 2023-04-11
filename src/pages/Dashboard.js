// react imports
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCameras, startCameraUpdates } from "../store/camera/cameraActions";
import { selectUserRequestStatus, selectUser } from "../store/user/userSlice";
import {
  selectCameras,
  selectServerResponseMessage,
} from "../store/camera/cameraSlice";

// bootstrap imports
import { Container, Placeholder } from "react-bootstrap";

// component imports
import Navigation from "../components/Navigation";

// library imports
import ParkingCamera from "../utils/ParkingCamera";
var _ = require("lodash");

const Dashboard = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const user = useSelector(selectUser);
  const userRequestStatus = useSelector(selectUserRequestStatus);
  const cameras = useSelector(selectCameras);
  const serverResponseMessage = useSelector(selectServerResponseMessage);

  useEffect(() => {
    getCameras(token);
  }, [token]);

  useEffect(() => {
    if (cameras) {
      console.log("useEffect ~ cameras:", cameras);
      dispatch(startCameraUpdates(cameras));
    }
  }, [cameras, user, dispatch]);

  let content;
  if (userRequestStatus === "loading") {
    content = (
      <>
        <Placeholder className="mt-4 d-flex flex-column" animation="wave">
          <Placeholder className="mb-2" xs={5} style={{ height: "32pt" }} />
        </Placeholder>
      </>
    );
  } else if (userRequestStatus === "succeeded") {
    content = (
      <>
        <h1 className="mt-4">Live Cameras:</h1>
        {_.map(cameras, (camera, index) => {
          if (!camera.data) {
            return (
              <Container key={index} className="ratio ratio-16x9 mb-2">
                <Placeholder animation="wave">
                  <Placeholder className="w-100 h-100" />
                </Placeholder>
              </Container>
            );
          } else {
            return (
              <ParkingCamera
                key={index}
                camera={camera}
                currentImage={camera.originalImage}
                parkingLocations={camera.data?.spots}
              />
            );
          }
        })}
      </>
    );
  } else if (userRequestStatus === "failed") {
    content = <p>{`Error: ${serverResponseMessage}`}</p>;
  }

  return (
    <div>
      <Navigation token={token} />
      <div className="w-full h-full d-flex flex-column overflow-hidden">
        <Container>{content}</Container>
      </div>
    </div>
  );
};

export default Dashboard;
