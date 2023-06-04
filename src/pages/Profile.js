// react imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT, selectUser } from "../store/user/userSlice";
import { selectCameras } from "../store/camera/cameraSlice";

// component imports
import Navigation from "../components/Navigation";
import { Button, Container, Image } from "react-bootstrap";
import { deleteUser } from "../store/user/userActions";
import { useNavigate } from "react-router-dom";

// library imports
var _ = require("lodash");

const Profile = () => {
  const user = useSelector(selectUser);
  const cameras = useSelector(selectCameras);
  console.log("Profile ~ cameras:", cameras);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteUserHandler = () => {
    const confirmAction = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmAction) {
      dispatch(deleteUser()).then(() => {
        dispatch(LOGOUT());
        navigate("/login");
      });
    }
  };

  return (
    <div>
      <Navigation />
      <Container className="mt-4">
        <h1>Profile Page</h1>
        <p>Logged in as: {user?.email}</p>
        <h2 className="mt-5">All available cameras:</h2>
        <hr />
        <div className="d-flex justify-content-between gap-5 flex-wrap flex-md-nowrap">
          {cameras?.length === 0 && <p>You don't have any cameras.</p>}
          {cameras &&
            _.map(cameras, (camera, index) => {
              console.log("Profile ~ camera:", camera);
              return (
                <div key={index} className="mx-auto">
                  <h5>{camera.name}</h5>
                  <p className="text-muted">{`Number of parking spaces: ${camera.parkingSpaces.length}`}</p>
                  <Image src={camera.sourceURL} className="w-100" />
                </div>
              );
            })}
        </div>
        <h2 className="mt-5">Account Control</h2>
        <hr />
        <div className="d-flex align-items-center justify-content-between">
          <span>
            Once you delete your account, there is no going back. Please be
            certain.
          </span>
          <Button variant="danger" onClick={deleteUserHandler}>
            Delete User
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
