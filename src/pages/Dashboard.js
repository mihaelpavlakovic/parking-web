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

var SCENE_BASE_WIDTH = 800;
var SCENE_BASE_HEIGHT = 600;

const Dashboard = () => {
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState("");
  const [parkingSpot, setParkingSpot] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const userEmail = useSelector(state => state.user.user?.email);
  const userId = useSelector(state => state.user.user?.id);
  const getStatus = useSelector(state => state.user.getUserStatus);
  const cameras = useSelector(state => state.camera.cameraData);
  const [userCameras, setUserCameras] = useState([]);

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const checkSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const scaleX = size.width / SCENE_BASE_WIDTH;
  const scaleY = size.height / SCENE_BASE_HEIGHT;

  useEffect(() => {
    dispatch(getCameras(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (cameras) {
      const currentUserCameras = _.filter(cameras, { userId: userId });
      setUserCameras(currentUserCameras);
    }
  }, [dispatch, cameras, userId]);

  useEffect(() => {
    const sse = new EventSource(
      `http://3.253.53.168:5050/rest-api/v1/stream?cameraId=${userCameras[1]?.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    function getRealtimeData(data) {
      console.log(data);
      setCurrentImage(data.occupancy.originalImage);
      setParkingSpot(data.occupancy.data.spots);
    }
    sse.onmessage = e => getRealtimeData(JSON.parse(e.data));
    sse.onerror = () => {
      sse.close();
    };
    return () => {
      sse.close();
    };
  }, [token, userCameras]);

  let content;
  if (getStatus === "loading") {
    content = (
      <Container>
        <Placeholder className="mt-4 d-flex flex-column" animation="wave">
          <Placeholder className="mb-2" xs={5} style={{ height: "32pt" }} />
          <Placeholder className="mb-3" xs={6} style={{ height: "15pt" }} />
        </Placeholder>
        <Container className="ratio ratio-16x9">
          <Placeholder animation="wave">
            <Placeholder className="w-100 h-100" />
          </Placeholder>
        </Container>
      </Container>
    );
  } else if (getStatus === "succeeded") {
    content = (
      <>
        <Container>
          <h1 className="mt-4">Dashboard</h1>
          {userEmail !== null && <p>Logged in as {userEmail}</p>}
        </Container>
        <div className="ratio ratio-16x9">
          {userCameras === [] ? (
            <Placeholder animation="wave">
              <Placeholder className="w-100 h-100" />
            </Placeholder>
          ) : (
            <>
              <Image
                id="imageContain"
                className="w-100 h-100"
                src={`data:image/png;base64, ${currentImage}`}
                alt="Parking lot feed"
              />
              <Stage
                width={size.width}
                height={size.height}
                scaleX={scaleX}
                scaleY={scaleY}
              >
                <Layer className="w-75 h-75">
                  {_.map(parkingSpot, (parkingSpace, index) => {
                    const flattenPolygon = _.flatten(parkingSpace.polygon);
                    return (
                      <>
                        <Text
                          text={`${parkingSpace.name} - ${parkingSpace.occupied}`}
                          fontSize={16}
                          fill="red"
                          x={(flattenPolygon[0] + flattenPolygon[2]) / 2}
                          y={(flattenPolygon[1] + flattenPolygon[3]) / 2}
                        />
                        <Line
                          key={index}
                          points={flattenPolygon}
                          closed
                          stroke="red"
                        />
                      </>
                    );
                  })}
                </Layer>
              </Stage>
            </>
          )}
        </div>
      </>
    );
  } else if (getStatus === "failed") {
    content = "Error";
  }

  return (
    <div>
      <Navigation token={token} />
      <div className="w-full h-full d-flex flex-column overflow-hidden">
        {content}
      </div>
    </div>
  );
};

export default Dashboard;
