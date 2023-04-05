// react imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// component imports
import Navigation from "../components/Navigation";
import { Container, Image } from "react-bootstrap";

// library imports
var _ = require("lodash");

const Profile = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const userId = useSelector(state => state.user.user?.id);
  const userEmail = useSelector(state => state.user.user?.email);
  const cameras = useSelector(state => state.camera.cameraData);
  const [userCameras, setUserCameras] = useState([]);

  useEffect(() => {
    if (cameras) {
      const currentUserCameras = _.filter(cameras, { userId: userId });
      setUserCameras(currentUserCameras);
    }
  }, [cameras, userId]);

  return (
    <div>
      <Navigation token={token} />
      <Container className="mt-4">
        <h1>Profile Page</h1>
        <p>Logged in as: {userEmail}</p>
        <h2 className="mt-5">All available cameras:</h2>
        <hr />
        <div className="d-flex justify-content-between flex-wrap">
          {_.map(userCameras, (userCamera, index) => {
            return (
              <div key={index} className="mx-auto">
                <h5>{userCamera.name}</h5>
                <p className="text-muted">{`Number of parking spaces: ${userCamera.parkingSpaces.length}`}</p>
                <Image src={userCamera.sourceURL} className="w-100" />
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default Profile;
