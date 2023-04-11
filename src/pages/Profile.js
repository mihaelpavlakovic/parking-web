// react imports
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../store/user/userSlice";
import { selectCameras } from "../store/camera/cameraSlice";

// component imports
import Navigation from "../components/Navigation";
import { Container, Image } from "react-bootstrap";

// library imports
var _ = require("lodash");

const Profile = () => {
  const user = useSelector(selectUser);
  const cameras = useSelector(selectCameras);

  return (
    <div>
      <Navigation />
      <Container className="mt-4">
        <h1>Profile Page</h1>
        <p>Logged in as: {user?.email}</p>
        <h2 className="mt-5">All available cameras:</h2>
        <hr />
        <div className="d-flex justify-content-between flex-wrap">
          {_.map(cameras, (camera, index) => {
            return (
              <div key={index} className="mx-auto">
                <h5>{camera.name}</h5>
                <p className="text-muted">{`Number of parking spaces: ${camera.parkingSpaces.length}`}</p>
                <Image src={camera.sourceURL} className="w-100" />
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default Profile;
