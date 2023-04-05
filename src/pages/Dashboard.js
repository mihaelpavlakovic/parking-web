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
import { Stage, Layer, Line, Text } from "react-konva";
var _ = require("lodash");

const Dashboard = () => {
  const dispatch = useDispatch();
  const [currentImages, setCurrentImages] = useState([]);
  const [parkingLocations, setParkingLocations] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const userEmail = useSelector(state => state.user.user?.email);
  const userId = useSelector(state => state.user.user?.id);
  const getStatus = useSelector(state => state.user.getUserStatus);
  const cameras = useSelector(state => state.camera.cameraData);
  const [userCameras, setUserCameras] = useState([]);
  const [size, setSize] = useState({ x: null, y: null });

  useEffect(() => {
    const checkSize = () => {
      const innerWidth = window.innerWidth;
      if (innerWidth < 430) {
        setSize({ x: 320, y: 180 });
      } else if (innerWidth > 430 && innerWidth < 750) {
        setSize({ x: 426, y: 240 });
      } else if (innerWidth > 750 && innerWidth < 1000) {
        setSize({ x: 640, y: 360 });
      } else if (innerWidth > 1000 && innerWidth < 1400) {
        setSize({ x: 854, y: 480 });
      } else if (innerWidth > 1400) {
        setSize({ x: 1280, y: 720 });
      }
    };

    if (size.x === null) {
      checkSize();
    }

    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, [size.x]);

  const scaleX = size.x / 640;
  const scaleY = size.y / 360;

  useEffect(() => {
    dispatch(getCameras(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (cameras) {
      const currentUserCameras = _.filter(cameras, { userId: userId });
      setUserCameras(currentUserCameras);
    }
  }, [cameras, userId]);

  useEffect(() => {
    const sseConnections = userCameras.map(userCamera => {
      const sse = new EventSource(
        `http://3.253.53.168:5050/rest-api/v1/stream?cameraId=${userCamera.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      function getRealtimeData(data) {
        // console.log(data);
        setCurrentImages(prevImages => ({
          ...prevImages,
          [userCamera.id]: data.occupancy.originalImage,
        }));
        setParkingLocations(prevSpots => ({
          ...prevSpots,
          [userCamera.id]: data.occupancy.data.spots,
        }));
      }
      sse.onmessage = e => getRealtimeData(JSON.parse(e.data));
      sse.onerror = () => {
        sse.close();
      };
      return sse;
    });

    Promise.all(sseConnections).then(() => {
      console.log("All SSE connections established!");
    });

    return () => {
      sseConnections.forEach(sse => sse.close());
    };
  }, [token, userCameras]);

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
        <h1 className="mt-4">Dashboard</h1>
        {userEmail !== null && <p>Logged in as {userEmail}</p>}
        {currentImages.length === 0
          ? _.map(userCameras, (userCamera, index) => {
              return (
                <Container key={index} className="ratio ratio-16x9 mb-2">
                  <Placeholder animation="wave">
                    <Placeholder className="w-100 h-100" />
                  </Placeholder>
                </Container>
              );
            })
          : Object.keys(currentImages).map((currentImage, index) => {
              return (
                <React.Fragment key={index}>
                  <h4>{userCameras[index].name}</h4>

                  <div className="ratio ratio-16x9 mb-2">
                    <Image
                      id="imageContain"
                      style={{ width: `${size.x}px`, height: `${size.y}px` }}
                      src={`data:image/png;base64, ${currentImages[currentImage]}`}
                      alt="Parking lot feed"
                    />
                    <Stage
                      width={size.x}
                      height={size.y}
                      scaleX={scaleX}
                      scaleY={scaleY}
                    >
                      <Layer>
                        {_.map(parkingLocations, parkingLocation => {
                          const parkingSpotsInfo = _.map(
                            parkingLocation,
                            parkingSpot => {
                              const flattenedParkingSpot = _.flatten(
                                parkingSpot.polygon
                              );
                              return {
                                flattenedParkingSpot,
                                name: parkingSpot.name,
                                occupied: parkingSpot.occupied,
                              };
                            }
                          );
                          return _.map(
                            parkingSpotsInfo,
                            (parkingSpot, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <Text
                                    text={`${parkingSpot.name} - ${parkingSpot.occupied}`}
                                    fontSize={16}
                                    fill={
                                      parkingSpot.occupied ? "red" : "green"
                                    }
                                    x={
                                      (parkingSpot.flattenedParkingSpot[0] +
                                        parkingSpot.flattenedParkingSpot[2]) /
                                      2
                                    }
                                    y={
                                      (parkingSpot.flattenedParkingSpot[1] +
                                        parkingSpot.flattenedParkingSpot[3]) /
                                      2
                                    }
                                  />
                                  <Line
                                    points={parkingSpot.flattenedParkingSpot}
                                    closed
                                    stroke={
                                      parkingSpot.occupied ? "red" : "green"
                                    }
                                  />
                                </React.Fragment>
                              );
                            }
                          );
                        })}
                      </Layer>
                    </Stage>
                  </div>
                </React.Fragment>
              );
            })}
      </>
    );
  } else if (getStatus === "failed") {
    content = <p>Error</p>;
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
