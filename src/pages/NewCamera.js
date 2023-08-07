// react imports
import React, { useEffect, useState } from "react";

// component imports
import { Button, Container, Form } from "react-bootstrap";
import { Stage, Layer, Circle, Image, Group } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { addCamera, fetchCameraFrame } from "../store/camera/cameraActions";
import FormItem from "../utils/FormItem";
import { useNavigate } from "react-router-dom";
import ParkingSpot from "../utils/ParkingSpot";
import _ from "lodash";
import "react-image-crop/dist/ReactCrop.css";
import { selectCameraFrame } from "../store/camera/cameraSlice";

const NewCamera = ({ handleCancle }) => {
  const [polygon, setPolygon] = useState([]);
  const [name, setName] = useState("");
  const [parkingType, setParkingType] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [cameraSource, setCameraSource] = useState("");
  const [error, setError] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputError, setInputError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [originalImageSize, setOriginalImageSize] = useState({
    width: 0,
    height: 0,
  });
  const cameraFrame = useSelector(selectCameraFrame);
  // console.log("NewCamera ~ cameraFrame:", cameraFrame);

  const handleStageClick = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const scaleX = originalImageSize.width / imageSize.width;
    const scaleY = originalImageSize.height / imageSize.height;

    const x = Math.round(pointerPosition.x * scaleX);
    const y = Math.round(pointerPosition.y * scaleY);
    const newSpot = [x, y];

    if (polygon.length < 4) {
      setPolygon([...polygon, newSpot]);
    }
  };

  const handleDotClick = (index) => {
    const updatedPolygon = [...polygon];
    updatedPolygon.splice(index, 1);
    setPolygon(updatedPolygon);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCameraNameChange = (e) => {
    setCameraName(e.target.value);
  };

  const handleCameraSourceChange = (e) => {
    setCameraSource(e.target.value);
  };

  const handleImageChange = (e) => {
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

  const handleDeleteParkingSpace = (index) => {
    const updatedParkingSpaces = [...parkingSpaces];
    updatedParkingSpaces.splice(index, 1);
    setParkingSpaces(updatedParkingSpaces);
  };

  const handleSubmission = (e) => {
    e.preventDefault();

    if (polygon.length === 4 && name !== "") {
      const existingParkingNames = parkingSpaces.map(
        (parkingSpace) => parkingSpace.name
      );
      if (existingParkingNames.includes(name)) {
        setError("Parking spot name is already in use.");
      } else {
        if (selectedImage) {
          // Calculate the scaled points based on the image size
          const scaledPolygon = polygon.map((point) => [point[0], point[1]]);

          // Create the new parking space with scaled points
          const newParkingSpace = {
            name,
            polygon: scaledPolygon,
            type: parkingType,
          };
          setParkingSpaces([...parkingSpaces, newParkingSpace]);
          setPolygon([]);
          setName("");
          setError("");
        } else {
          setError("Please select an image first.");
        }
      }
    } else {
      setError("Please enter parking spot name.");
    }
  };

  const handleSubmitStreamUrl = (e) => {
    e.preventDefault();

    if (cameraSource === "") {
      setInputError("Please fill out every input field.");
      return;
    }

    dispatch(fetchCameraFrame({ cameraSource }));
  };

  const handleSubmit = (e) => {
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

    dispatch(addCamera(createParkingCamera)).then(() => {
      setCameraName("");
      setCameraSource("");
      setParkingSpaces([]);
      setInputError("");
      navigate("/");
    });
  };

  const handleDragMove = (index, e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const scaleX = originalImageSize.width / imageSize.width;
    const scaleY = originalImageSize.height / imageSize.height;

    const x = Math.round(pointerPosition.x * scaleX);
    const y = Math.round(pointerPosition.y * scaleY);

    const updatedPolygon = [...polygon];
    updatedPolygon[index] = [x, y];
    setPolygon(updatedPolygon);
  };

  useEffect(() => {
    const handleResize = () => {
      // Calculate the aspect ratio of the image
      const aspectRatio = 16 / 9;

      // Get the container width and calculate the maximum width for the image
      const containerWidth = window.innerWidth;
      const maxWidth = Math.min(containerWidth, window.innerWidth - 170);

      // Calculate the corresponding height based on the aspect ratio
      const height = maxWidth / aspectRatio;

      // If the calculated width is greater than the container width, scale down the width and recalculate the height
      if (maxWidth > containerWidth) {
        const scaledWidth = containerWidth;
        const scaledHeight = scaledWidth / aspectRatio;
        setImageSize({ width: scaledWidth, height: scaledHeight });
      } else {
        setImageSize({ width: maxWidth, height: height });
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (selectedImage) {
      setOriginalImageSize({
        width: selectedImage.width,
        height: selectedImage.height,
      });
    }
  }, [selectedImage]);

  return (
    <div>
      <Container>
        <h3 className="mb-3">Add new camera:</h3>
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
          <div className="d-flex flex-row gap-3">
            <FormItem
              labelText="URL for camera source"
              inputType="text"
              formId="cameraSource"
              formValue={cameraSource}
              handleChangeValue={handleCameraSourceChange}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleSubmitStreamUrl}
            >
              Submit
            </Button>
          </div>
          <FormItem
            labelText="Select an image"
            inputType="file"
            formId="imageUpload"
            handleChangeValue={handleImageChange}
            acceptValue="image/*"
          />
          {selectedImage !== null && (
            <div
              style={{
                width: imageSize.width,
                height: imageSize.height,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Stage
                width={imageSize.width}
                height={imageSize.height}
                style={{ position: "absolute", top: 0, left: 0 }}
                onClick={handleStageClick}
              >
                <Layer>
                  {selectedImage && (
                    <Image
                      image={selectedImage}
                      width={imageSize.width}
                      height={imageSize.height}
                    />
                  )}
                  {originalImageSize.width !== 0 &&
                    originalImageSize.height !== 0 && (
                      <Group
                        scaleX={
                          originalImageSize.width !== 0
                            ? imageSize.width / originalImageSize.width
                            : 1
                        }
                        scaleY={
                          originalImageSize.height !== 0
                            ? imageSize.height / originalImageSize.height
                            : 1
                        }
                      >
                        {parkingSpaces?.map((parkingSpace) => {
                          const flattenedParkingSpot = _.flatten(
                            parkingSpace.polygon
                          );
                          const parkingSpots = {
                            name: parkingSpace.name,
                            occupied: true,
                            flattenedParkingSpot,
                          };
                          return (
                            <ParkingSpot
                              key={parkingSpots.name}
                              parkingSpot={parkingSpots}
                              scaleX={
                                originalImageSize.width !== 0
                                  ? imageSize.width / originalImageSize.width
                                  : 1
                              }
                              scaleY={
                                originalImageSize.height !== 0
                                  ? imageSize.height / originalImageSize.height
                                  : 1
                              }
                            />
                          );
                        })}
                        {polygon.map((spot, index) => {
                          const scaleX =
                            imageSize.width / originalImageSize.width;
                          const scaleY =
                            imageSize.height / originalImageSize.height;

                          // Calculate the actual radius based on scaling and base radius
                          const circleRadius = 6 / Math.min(scaleX, scaleY);
                          return (
                            <Circle
                              key={index}
                              x={spot[0]}
                              y={spot[1]}
                              radius={circleRadius}
                              fill="red"
                              onClick={() => handleDotClick(index)}
                              draggable
                              onDragMove={(e) => handleDragMove(index, e)}
                            />
                          );
                        })}
                      </Group>
                    )}
                </Layer>
              </Stage>
            </div>
          )}
          {error && <p className="text-danger">{error}</p>}
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
              <Form.Select
                label="Parking space type:"
                onChange={(e) => setParkingType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="normal">normal</option>
                <option value="disabled">disabled</option>
                <option value="reserved">reserved</option>
              </Form.Select>
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
            <div className="d-flex flex-column gap-2">
              {parkingSpaces.map((parkingSpace, index) => {
                const allParkingTypes = ["normal", "disabled", "reserved"];
                const parkingTypeOptions = allParkingTypes.filter(
                  (option) => option !== parkingSpace.type
                );
                return (
                  <div className="d-flex gap-2" key={index}>
                    <FormItem
                      labelText="Name parking space"
                      inputType="text"
                      formId={`name-${index}`}
                      formValue={parkingSpace?.name}
                      handleChangeValue={(e) => handleNameChange(e, index)}
                    />
                    <Form.Select
                      value={parkingSpace.type}
                      onChange={(e) => {
                        const updatedParkingSpaces = [...parkingSpaces];
                        updatedParkingSpaces[index].type = e.target.value;
                        setParkingSpaces(updatedParkingSpaces);
                      }}
                    >
                      <option value={parkingSpace.type}>
                        {parkingSpace.type}
                      </option>
                      {parkingTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      variant="danger"
                      onClick={() => {
                        handleDeleteParkingSpace(index);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          <Button type="submit" variant="primary" className="py-2">
            Submit
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="mb-5 py-2"
            onClick={handleCancle}
          >
            Cancle
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default NewCamera;
