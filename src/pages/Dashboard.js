// react imports
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCameras } from "../store/camera/cameraActions";
import { selectUserRequestStatus } from "../store/user/userSlice";
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
  const userRequestStatus = useSelector(selectUserRequestStatus);
  const cameras = useSelector(selectCameras);
  console.log("Dashboard ~ cameras:", cameras);
  const serverResponseMessage = useSelector(selectServerResponseMessage);

  useEffect(() => {
    getCameras();
  }, []);

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
        <h1 className="mt-4 fw-bold" style={{ fontFamily: "Fira Sans" }}>
          Live Cameras:
        </h1>
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
                parkingLocations={camera.data?.result?.spots}
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
      <Navigation />
      <div className="w-full h-full d-flex flex-column overflow-hidden">
        <Container>{content}</Container>
      </div>
    </div>
  );
};

export default Dashboard;
