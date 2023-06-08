// react imports
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT, selectUser } from "../store/user/userSlice";
import { selectCameras } from "../store/camera/cameraSlice";

// component imports
import Navigation from "../components/Navigation";
import { Button, Container, Image } from "react-bootstrap";
import { deleteUser } from "../store/user/userActions";
import { useNavigate } from "react-router-dom";
import { removeCamera } from "../store/camera/cameraActions";
import ModalItem from "../utils/ModalItem";

// library imports
var _ = require("lodash");

const Profile = () => {
  const user = useSelector(selectUser);
  const cameras = useSelector(selectCameras);
  const [modalShow, setModalShow] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = cameraId => {
    dispatch(removeCamera(cameraId));
  };

  const handleUpdate = camera => {
    setSelectedCamera(camera);
    setModalShow(true);
  };

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
        {modalShow && (
          <ModalItem
            modalShow={modalShow}
            handleClose={() => setModalShow(false)}
            modalTitle={selectedCamera ? selectedCamera.name : ""}
            camera={selectedCamera}
          />
        )}
        <h1>Profile Page</h1>
        <p>Logged in as: {user?.email}</p>
        <h2 className="mt-5">All available cameras:</h2>
        <hr />
        <div className="d-flex flex-column justify-content-center gap-5">
          {cameras?.length === 0 && <p>You don't have any cameras.</p>}
          <div className="row">
            {cameras &&
              _.map(cameras, (camera, index) => {
                return (
                  <div key={index} className="col-12 col-md-6 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5>{camera.name}</h5>
                      <div className="d-flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => handleUpdate(camera)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(camera.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted">{`Number of parking spaces: ${camera.parkingSpaces.length}`}</p>
                    <Image src={camera.sourceURL} className="w-100" />
                  </div>
                );
              })}
          </div>
        </div>
        <h2 className="mt-5">Account Control</h2>
        <hr />
        <div className="d-flex align-items-center justify-content-between mb-5">
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
