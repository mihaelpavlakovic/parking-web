// react imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCameras } from "../store/camera/cameraActions";

// bootstrap imports
import { Container, Placeholder } from "react-bootstrap";
import Image from "react-bootstrap/Image";

// component imports
import Navigation from "../components/Navigation";

// library imports
import { Stage, Layer, Line } from "react-konva";
var _ = require("lodash");

const Dashboard = () => {
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState("");
  const [polygon, setPolygons] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const userEmail = useSelector(state => state.user.user?.email);
  const userId = useSelector(state => state.user.user?.id);
  const getStatus = useSelector(state => state.user.getUserStatus);
  const cameras = useSelector(state => state.camera.cameraData);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getCameras(token));
      cameras?.forEach(camera => {
        const cameraURL = camera.sourceURL;
        if (userId === camera.userId) {
          const parkingPolygons = _.map(camera.parkingSpaces, parking => {
            return _.flatten(parking.polygon);
          });
          setPolygons(parkingPolygons);
          setCurrentImage(cameraURL + Math.random());
        } else return;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch, token, cameras, userId]);

  let content;
  if (getStatus === "loading") {
    content = (
      <>
        <Placeholder className="mt-4 d-flex flex-column" animation="wave">
          <Placeholder className="mb-2" xs={5} style={{ height: "32pt" }} />
          <Placeholder className="mb-3" xs={6} style={{ height: "15pt" }} />
        </Placeholder>
        <Container className="ratio ratio-16x9">
          <Placeholder animation="wave">
            <Placeholder className="w-100 h-100" />
          </Placeholder>
        </Container>
      </>
    );
  } else if (getStatus === "succeeded") {
    content = (
      <>
        <div>
          <h1 className="mt-4">Dashboard</h1>
          {userEmail !== null && <p>Logged in as {userEmail}</p>}
        </div>
        <Container className="ratio ratio-16x9">
          {currentImage === "" ? (
            <Placeholder animation="wave">
              <Placeholder className="w-100 h-100" />
            </Placeholder>
          ) : (
            <div>
              <Image width={"100%"} src={currentImage} alt="Parking lot feed" />
              <Stage
                width={1296}
                height={729}
                className="position-absolute top-0 left-0"
              >
                <Layer className="shapes-layer">
                  {_.map(polygon, (parkingSpace, index) => {
                    return (
                      <Line
                        key={index}
                        points={parkingSpace}
                        closed
                        stroke="red"
                      />
                    );
                  })}
                </Layer>
              </Stage>
            </div>
          )}
        </Container>
      </>
    );
  } else if (getStatus === "failed") {
    content = "Error";
  }

  return (
    <div>
      <Navigation token={token} />
      <Container className="w-full h-full d-flex flex-column gap-4">
        {content}
      </Container>
    </div>
  );
};

export default Dashboard;
