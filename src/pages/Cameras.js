import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { Button, Container, Image } from "react-bootstrap";
import { removeCamera } from "../store/camera/cameraActions";
import ModalItem from "../utils/ModalItem";
import { selectCameras } from "../store/camera/cameraSlice";
import { useDispatch, useSelector } from "react-redux";
import NewCamera from "./NewCamera";

// library imports
var _ = require("lodash");

const Cameras = () => {
  const cameras = useSelector(selectCameras);
  const [modalShow, setModalShow] = useState(false);
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const dispatch = useDispatch();

  const handleDelete = cameraId => {
    dispatch(removeCamera(cameraId));
  };

  const handleUpdate = camera => {
    setSelectedCamera(camera);
    setModalShow(true);
  };

  const handleAddCamera = () => {
    setShowAddCamera(!showAddCamera);
  };

  return (
    <div>
      <Navigation />
      {modalShow && (
        <ModalItem
          modalShow={modalShow}
          handleClose={() => setModalShow(false)}
          modalTitle={selectedCamera ? selectedCamera.name : ""}
          camera={selectedCamera}
        />
      )}
      <Container className="mt-4">
        <h1 className="mb-4">Available cameras:</h1>
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
                          Edit
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
        {!showAddCamera && (
          <Button variant="primary" onClick={handleAddCamera}>
            Add Camera
          </Button>
        )}
        {showAddCamera && <NewCamera handleCancle={handleAddCamera} />}
      </Container>
    </div>
  );
};

export default Cameras;
