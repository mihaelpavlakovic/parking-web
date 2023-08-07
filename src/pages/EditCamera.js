import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormItem from "../utils/FormItem";
import { Circle, Group, Layer, Stage, Image } from "react-konva";
import ParkingSpot from "../utils/ParkingSpot";
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { updateCamera } from "../store/camera/cameraActions";
import { selectCameras } from "../store/camera/cameraSlice";
import Navigation from "../components/Navigation";
import useImageScaler from "../hooks/useImageScaler";
import useImageSelector from "../hooks/useImageSelector";

const EditCamera = () => {
  const { cameraId } = useParams();
  const [polygon, setPolygon] = useState([]);
  const [name, setName] = useState("");
  const cameras = useSelector(selectCameras);
  const [camera, setCamera] = useState(null);
  const [cameraName, setCameraName] = useState("");
  const [cameraSource, setCameraSource] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [parkingType, setParkingType] = useState("");
  const { imageSize, originalImageSize, setOriginalImageSize } =
    useImageScaler();
  const { selectedImage } = useImageSelector(camera?.sourceURL);

  useEffect(() => {
    if (selectedImage) {
      setOriginalImageSize({
        width: selectedImage.width,
        height: selectedImage.height,
      });
    }
  }, [selectedImage, setOriginalImageSize]);

  useEffect(() => {
    if (!isDataFetched) {
      const fetchData = async () => {
        const fetchedCameraData = cameras.find(
          (camera) => camera.id === cameraId
        );

        if (fetchedCameraData) {
          setCamera(fetchedCameraData);
          setCameraName(fetchedCameraData.name);
          setCameraSource(fetchedCameraData.sourceURL);
          setParkingSpaces(fetchedCameraData.parkingSpaces);
          setIsDataFetched(true);
        }
      };

      fetchData();
    }
  }, [cameraId, cameras, isDataFetched]);

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

  const handleDeleteParkingSpace = (index) => {
    const updatedParkingSpaces = [...parkingSpaces];
    updatedParkingSpaces.splice(index, 1);
    setParkingSpaces(updatedParkingSpaces);
  };

  const handleDotClick = (index) => {
    const updatedPolygon = [...polygon];
    updatedPolygon.splice(index, 1);
    setPolygon(updatedPolygon);
  };

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

  const handleNameChange = (e, index) => {
    const updatedParkingSpaces = [...parkingSpaces];
    const updatedParkingSpace = {
      ...updatedParkingSpaces[index],
      name: e.target.value,
    };
    updatedParkingSpaces[index] = updatedParkingSpace;
    setParkingSpaces(updatedParkingSpaces);
  };

  const handleCameraNameChange = (e) => {
    setCameraName(e.target.value);
  };

  const handleCameraSourceChange = (e) => {
    setCameraSource(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateCamera({
        id: cameraId,
        sourceURL: cameraSource,
        name: cameraName,
        parkingSpaces,
      })
    );

    navigate("/cameras");
  };

  return (
    <div>
      <Navigation />
      <Container className="mt-4">
        {camera ? (
          <>
            <h3 className="mb-3">Edit Camera - {cameraId}</h3>
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

              <Stage
                width={imageSize.width}
                height={imageSize.height}
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
              {error && <p className="text-danger">{error}</p>}
              {polygon.length === 4 && (
                <div className="d-flex gap-2">
                  <FormItem
                    labelText="Name parking space"
                    inputType="text"
                    formId="name"
                    formValue={name}
                    handleChangeValue={(e) => setName(e.target.value)}
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
              {parkingSpaces?.map((parkingSpace, index) => {
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
              <Button variant="primary" type="submit">
                Update
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate("/cameras")}
              >
                Cancel
              </Button>
            </form>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </div>
  );
};

export default EditCamera;
