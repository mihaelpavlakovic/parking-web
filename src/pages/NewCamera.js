// react imports
import React, { useEffect, useState } from "react";

// component imports
import { Button, Container, Form } from "react-bootstrap";
import { Stage, Layer, Circle, Image, Group } from "react-konva";
import { useDispatch } from "react-redux";
import { addCamera } from "../store/camera/cameraActions";
import FormItem from "../utils/FormItem";
import { useNavigate } from "react-router-dom";
import ParkingSpot from "../utils/ParkingSpot";
import _ from "lodash";
import useImageScaler from "../hooks/useImageScaler";
import useImageSelector from "../hooks/useImageSelector";
import { calculateScaledPoint } from "../utils";
import ParkingSpaceInput from "../utils/ParkingSpaceInput";

const NewCamera = ({ handleCancle }) => {
  const [polygon, setPolygon] = useState([]);
  const [name, setName] = useState("");
  const [parkingType, setParkingType] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [cameraSource, setCameraSource] = useState("");
  const [error, setError] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [inputError, setInputError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedImage, handleImageChange } = useImageSelector();
  const { imageSize, originalImageSize, setOriginalImageSize } =
    useImageScaler();

  const handleStageClick = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const scaledPoint = calculateScaledPoint(
      { x: pointerPosition.x, y: pointerPosition.y },
      imageSize,
      originalImageSize
    );

    if (polygon.length < 4) {
      setPolygon([...polygon, scaledPoint]);
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

  const handleTypeChange = (e, index) => {
    const updatedParkingSpaces = [...parkingSpaces];
    updatedParkingSpaces[index].type = e.target.value;
    setParkingSpaces(updatedParkingSpaces);
  };

  const handleDeleteParkingSpace = (index) => {
    const updatedParkingSpaces = [...parkingSpaces];
    updatedParkingSpaces.splice(index, 1);
    setParkingSpaces(updatedParkingSpaces);
  };

  const handleDragMove = (index, e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const scaledPoint = calculateScaledPoint(
      { x: pointerPosition.x, y: pointerPosition.y },
      imageSize,
      originalImageSize
    );

    const updatedPolygon = [...polygon];
    updatedPolygon[index] = scaledPoint;
    setPolygon(updatedPolygon);
  };

  useEffect(() => {
    if (selectedImage) {
      setOriginalImageSize({
        width: selectedImage.width,
        height: selectedImage.height,
      });
    }
  }, [selectedImage, setOriginalImageSize]);

  const handleParkingSpotSubmit = (e) => {
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

  const handleFormSubmit = (e) => {
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
        <form onSubmit={handleFormSubmit} className="d-flex flex-column gap-3">
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
                onClick={handleParkingSpotSubmit}
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
                  <ParkingSpaceInput
                    key={parkingSpace.name}
                    parkingSpace={parkingSpace}
                    parkingTypeOptions={parkingTypeOptions}
                    index={index}
                    handleNameChange={handleNameChange}
                    handleTypeChange={handleTypeChange}
                    handleDeleteParkingSpace={handleDeleteParkingSpace}
                  />
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
