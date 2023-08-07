import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { Button, Container, Image } from "react-bootstrap";
import { removeCamera } from "../store/camera/cameraActions";
import { selectCameras } from "../store/camera/cameraSlice";
import { useDispatch, useSelector } from "react-redux";
import NewCamera from "./NewCamera";
import { Link } from "react-router-dom";

// library imports
var _ = require("lodash");

const Cameras = () => {
  const cameras = useSelector(selectCameras);
  const [showAddCamera, setShowAddCamera] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = (cameraId) => {
    dispatch(removeCamera(cameraId));
  };

  const handleAddCamera = () => {
    setShowAddCamera(!showAddCamera);
  };

  return (
    <div>
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
        {showAddCamera && <NewCamera handleCancle={handleAddCamera} />}
        <div className="d-flex flex-column justify-content-center gap-5 mt-3">
          {cameras?.length === 0 && <p>You don't have any cameras.</p>}
          <div className="row">
            {cameras &&
              _.map(cameras, (camera, index) => {
                return (
                  <div key={index} className="col-12 col-md-6 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5>{camera.name}</h5>
                      <div className="d-flex gap-2">
                        <Link to={`/cameras/${camera.id}`}>
                          <Button variant="secondary">Edit</Button>
                        </Link>
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
      </Container>
    </div>
  );
};

export default Cameras;
