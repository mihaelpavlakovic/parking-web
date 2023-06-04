// react imports
import React, { useEffect, useState } from "react";

// component imports
import { Button, Container } from "react-bootstrap";
import { Stage, Layer, Circle, Image, Group } from "react-konva";
import Navigation from "../components/Navigation";
import { useDispatch } from "react-redux";
import { addCamera } from "../store/camera/cameraActions";
import FormItem from "../utils/FormItem";

const NewCamera = () => {
  const [polygon, setPolygon] = useState([]);
  const [name, setName] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [cameraSource, setCameraSource] = useState("");
  const [error, setError] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputError, setInputError] = useState("");
  const dispatch = useDispatch();

  // Add state for size and scale factors
  const [size, setSize] = useState({ x: null, y: null });
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const calculateSizeAndScale = () => {
    const innerWidth = window.innerWidth;
    let width, height, scaleX, scaleY;

    if (innerWidth < 430) {
      width = 320;
      height = 180;
    } else if (innerWidth >= 430 && innerWidth < 750) {
      width = 426;
      height = 240;
    } else if (innerWidth >= 750 && innerWidth < 1000) {
      width = 640;
      height = 360;
    } else if (innerWidth >= 1000 && innerWidth < 1400) {
      width = 854;
      height = 480;
    } else {
      width = 1280;
      height = 720;
    }

    scaleX = width / 640;
    scaleY = height / 360;

    return { width, height, scaleX, scaleY };
  };
  // Calculate size and scale factors on component mount and window resize
  useEffect(() => {
    const handleResize = () => {
      const { width, height, scaleX, scaleY } = calculateSizeAndScale();
      setSize({ x: width, y: height });
      setScaleX(scaleX);
      setScaleY(scaleY);
    };

    handleResize(); // Call the function on component mount

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleDeleteParkingSpace = index => {
    const updatedParkingSpaces = [...parkingSpaces];
    updatedParkingSpaces.splice(index, 1);
    setParkingSpaces(updatedParkingSpaces);
  };

  const handleSubmission = e => {
    e.preventDefault();

    if (polygon.length === 4 && name !== "") {
      const newParkingSpace = { name, polygon };
      setParkingSpaces([...parkingSpaces, newParkingSpace]);
      setPolygon([]);
      setName("");
      setError("");
    } else {
      setError("Please enter parking spot name.");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (
      cameraName === "" &&
      cameraSource === "" &&
      parkingSpaces.length === 0
    ) {
      setInputError("Please fill out every input field.");
      return;
    }
    const createParkingCamera = {
      name: cameraName,
      sourceURL: cameraSource,
      parkingSpaces,
    };

    dispatch(addCamera(createParkingCamera));
    setCameraName("");
    setCameraSource("");
    setParkingSpaces([]);
    setInputError("");
  };

  return (
    <div>
      <Navigation />
      <Container className="mt-4">
        <h1 className="mb-3">Add new camera:</h1>
        {inputError && (
          <p className="text-danger border border-danger rounded p-3 d-flex justify-content-between">
            {inputError}
            <span
              onClick={() => setInputError("")}
              className="text-right"
              style={{ cursor: "pointer" }}
            >
              Dismiss
            </span>
          </p>
        )}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <FormItem
            labelText="Parking location name"
            inputType="text"
            formId="cameraName"
            formValue={cameraName}
            handleChangeValue={handleCameraNameChange}
          />
          <FormItem
            labelText="URL for camera source"
            inputType="text"
            formId="cameraSource"
            formValue={cameraSource}
            handleChangeValue={handleCameraSourceChange}
          />
          <FormItem
            labelText="Select an image"
            inputType="file"
            formId="imageUpload"
            handleChangeValue={handleImageChange}
            acceptValue="image/*"
          />
          {selectedImage !== null && (
            <Stage
              width={size.x}
              height={size.y}
              scaleX={scaleX}
              scaleY={scaleY}
              onClick={handleStageClick}
            >
              <Layer>
                {selectedImage && (
                  <Image
                    image={selectedImage}
                    width={size.x}
                    height={size.y}
                    draggable={false}
                  />
                )}
                <Group scaleX={1 / scaleX} scaleY={1 / scaleY}>
                  {polygon.map((spot, index) => (
                    <Circle
                      key={index}
                      x={spot[0]}
                      y={spot[1]}
                      radius={6}
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
                </Group>
              </Layer>
            </Stage>
          )}
          {polygon.length === 4 && (
            <div className="d-flex gap-2">
              <FormItem
                labelText="Name parking space"
                inputType="text"
                formId="name"
                formValue={name}
                handleChangeValue={handleNameChange}
                addStyle={{
                  borderColor: error ? "red" : "initial",
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleSubmission}
              >
                Submit
              </Button>
            </div>
          )}
          {parkingSpaces && (
            <div>
              {parkingSpaces.map((parkingSpace, index) => {
                return (
                  <div className="d-flex align-items-center gap-3">
                    <p key={index}>
                      {parkingSpace.name} -{" "}
                      {JSON.stringify(parkingSpace.polygon)}
                    </p>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => handleDeleteParkingSpace(index)}
                    >
                      Delete
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          <Button type="submit" variant="primary" className="mb-5 py-2">
            Submit
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default NewCamera;
