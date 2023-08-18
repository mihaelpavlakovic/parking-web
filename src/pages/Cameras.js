import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { Button, Container, Image, Modal } from "react-bootstrap";
import { removeCamera } from "../store/camera/cameraActions";
import { selectCameras } from "../store/camera/cameraSlice";
import { useDispatch, useSelector } from "react-redux";
import NewCamera from "./NewCamera";
import { Link } from "react-router-dom";
import SpinnerItem from "../utils/SpinnerItem";

// library imports
var _ = require("lodash");

const Cameras = () => {
  const cameras = useSelector(selectCameras);
  const [showAddCamera, setShowAddCamera] = useState(false);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cameraForDeletion, setCameraForDeletion] = useState("");

  const handleDelete = cameraId => {
    dispatch(removeCamera(cameraId));
    setShowDeleteModal(false);
  };

  const handleAddCamera = () => {
    setShowAddCamera(!showAddCamera);
  };

  return (
    <div>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete camera - {cameraForDeletion.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the camera?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => handleDelete(cameraForDeletion.id)}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Navigation />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1>Available cameras:</h1>
          {!showAddCamera && (
            <Button variant="primary" onClick={handleAddCamera}>
              Add Camera
            </Button>
          )}
        </div>
        {showAddCamera && <NewCamera handleCancel={handleAddCamera} />}
        <div className="d-flex flex-column justify-content-center gap-5 mt-3">
          {cameras?.length === 0 && <p>You don't have any cameras.</p>}
          <div className="row">
            {cameras &&
              _.map(cameras, (camera, index) => {
                return (
                  <div key={index} className="col-12 col-md-6 col-lg-4 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5>{camera.name}</h5>
                      <div className="d-flex gap-2">
                        <Link to={`/cameras/${camera.id}`}>
                          <Button variant="secondary">Edit</Button>
                        </Link>
                        <Button
                          variant="danger"
                          onClick={() => {
                            setCameraForDeletion(camera);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted">{`Number of parking spaces: ${camera.parkingSpaces.length}`}</p>
                    {camera.originalImage ? (
                      <Image
                        src={`data:image/png;base64, ${camera.originalImage}`}
                        className="w-100"
                      />
                    ) : (
                      <SpinnerItem />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Cameras;
