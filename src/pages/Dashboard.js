// react imports
import { useSelector } from "react-redux";

// store imports
import { selectUserRequestStatus } from "../store/user/userSlice";
import {
  selectCameras,
  selectServerResponseMessage,
} from "../store/camera/cameraSlice";

// component imports
import Navigation from "../components/Navigation";

// library imports
import { Container, Placeholder } from "react-bootstrap";
import ParkingCamera from "../utils/ParkingCamera";
var _ = require("lodash");

const Dashboard = () => {
  const userRequestStatus = useSelector(selectUserRequestStatus);
  const cameras = useSelector(selectCameras);
  const serverResponseMessage = useSelector(selectServerResponseMessage);

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
        {cameras?.length === 0 && (
          <p>You don't have any live cameras to display.</p>
        )}
        {_.map(cameras, (camera, index) => {
          if (!camera?.originalImage) {
            return (
              <Container
                key={index}
                className="ratio ratio-16x9 mb-2 overflow-hidden"
              >
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
                parkingLocations={camera.spots}
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
