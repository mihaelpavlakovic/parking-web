// react imports
import React, { useState } from "react";

// component imports
import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";
import { Stage, Layer, Circle, Image, Group } from "react-konva";

const NewCamera = () => {
  const [polygon, setPolygon] = useState([]);
  const [name, setName] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [cameraSource, setCameraSource] = useState("");
  const [error, setError] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleStageClick = e => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const x = parseInt(pointerPosition.x, 10);
    const y = parseInt(pointerPosition.y, 10);
    const newSpot = [x, y];

    if (polygon.length < 4) {
      setPolygon([...polygon, newSpot]);
    }
  };

  const handleNameChange = e => {
    setName(e.target.value);
  };

  const handleCameraNameChange = e => {
    setCameraName(e.target.value);
  };

  const handleCameraSourceChange = e => {
    setCameraSource(e.target.value);
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.src = reader.result;
      image.onload = () => {
        setSelectedImage(image);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleDotClick = index => {
    const updatedPolygon = [...polygon];
    updatedPolygon.splice(index, 1);
    setPolygon(updatedPolygon);
  };

  const handleSubmission = () => {
    if (polygon.length === 4 && name !== "") {
      const newParkingSpace = { name, polygon };
      setParkingSpaces([...parkingSpaces, newParkingSpace]);
      setPolygon([]);
      setName("");
    } else {
      setError("Please enter parking spot name.");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const createParkingCamera = {
      name: cameraName,
      sourceURL: cameraSource,
      parkingSpaces,
    };

    console.log(createParkingCamera);
    setCameraName("");
    setCameraSource("");
    setParkingSpaces([]);
  };
  return (
    <div>
      <Navigation />
      <Container className="mt-4">
        <h1>Add new camera:</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="cameraName">Parking location name:</label>
            <input
              type="text"
              id="cameraName"
              value={cameraName}
              onChange={handleCameraNameChange}
            />
          </div>
          <div>
            <label htmlFor="cameraSource">URL for camera source:</label>
            <input
              type="text"
              id="cameraSource"
              value={cameraSource}
              onChange={handleCameraSourceChange}
            />
          </div>
          <div>
            <label htmlFor="imageUpload">Select an image:</label>
            <input
              type="file"
              id="imageUpload"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <Stage width={500} height={500} onClick={handleStageClick}>
            <Layer>
              <Group>
                {selectedImage && (
                  <Image
                    image={selectedImage}
                    width={500}
                    height={500}
                    draggable={false}
                  />
                )}
              </Group>
              {polygon.map((spot, index) => (
                <Circle
                  key={index}
                  x={spot[0]}
                  y={spot[1]}
                  radius={5}
                  fill="red"
                  onClick={() => handleDotClick(index)}
                  draggable
                  onDragMove={e => {
                    const updatedPolygon = [...polygon];
                    updatedPolygon[index] = [e.target.x(), e.target.y()];
                    setPolygon(updatedPolygon);
                  }}
                />
              ))}
            </Layer>
          </Stage>
          {polygon.length === 4 && (
            <div>
              <label htmlFor="name">Name parking space:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                style={{ borderColor: error ? "red" : "initial" }}
              />
              <button onClick={handleSubmission}>Submit</button>
            </div>
          )}
          {parkingSpaces &&
            parkingSpaces.map((parkingSpace, index) => {
              return (
                <p key={index}>
                  {parkingSpace.name} - {JSON.stringify(parkingSpace.polygon)}
                </p>
              );
            })}
          <button type="submit">Submit</button>
        </form>
      </Container>
    </div>
  );
};

export default NewCamera;
