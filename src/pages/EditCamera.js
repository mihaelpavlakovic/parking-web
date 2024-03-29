import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormItem from "../utils/FormItem";
import { Circle, Group, Layer, Stage, Image } from "react-konva";
import ParkingSpot from "../utils/ParkingSpot";
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
  fetchStreamPicture,
  updateCamera,
} from "../store/camera/cameraActions";
import {
  dismissFetchStreamPictureError,
  removeFetchedStreamPicture,
  selectCameras,
  selectFetchStreamPictureError,
  selectFetchStreamPictureStatus,
  selectFetchStreamResponseError,
  selectStreamPicture,
} from "../store/camera/cameraSlice";
import Navigation from "../components/Navigation";
import useImageScaler from "../hooks/useImageScaler";
import useImageSelector from "../hooks/useImageSelector";
import { calculateScaledPoint } from "../utils";
import ParkingSpaceInput from "../utils/ParkingSpaceInput";
import ErrorMessage from "../components/ErrorMessage";
import SpinnerItem from "../utils/SpinnerItem";

const EditCamera = () => {
  const { cameraId } = useParams();
  const streamPicture = useSelector(selectStreamPicture);
  const [polygon, setPolygon] = useState([]);
  const [parkingSpotName, setParkingSpotName] = useState("");
  const [cameraToken, setCameraToken] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authUsernameError, setAuthUsernameError] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [parkingSpotNameError, setParkingSpotNameError] = useState("");
  const [parkingSpotType, setParkingSpotType] = useState("");
  const [parkingSpotTypeError, setParkingSpotTypeError] = useState("");
  const cameras = useSelector(selectCameras);
  const [camera, setCamera] = useState(null);
  const [cameraName, setCameraName] = useState("");
  const [cameraNameError, setCameraNameError] = useState("");
  const [cameraSource, setCameraSource] = useState("");
  const [cameraSourceError, setCameraSourceError] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [parkingSpacesError, setParkingSpacesError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDataFetched, setIsDataFetched] = useState(false);
  const { imageSize, originalImageSize, setOriginalImageSize } =
    useImageScaler();
  const { selectedImage } = useImageSelector(streamPicture);
  const cameraStatus = useSelector(selectFetchStreamPictureStatus);
  const cameraError = useSelector(selectFetchStreamResponseError);
  const cameraErrorMessage = useSelector(selectFetchStreamPictureError);
  const [showPassword, setShowPassword] = useState("");

  useEffect(() => {
    setCameraNameError("");
  }, [cameraName]);

  useEffect(() => {
    setCameraSourceError("");
  }, [cameraSource]);

  useEffect(() => {
    setParkingSpacesError("");
  }, [parkingSpaces]);

  useEffect(() => {
    setParkingSpotNameError("");
  }, [parkingSpotName]);

  useEffect(() => {
    setParkingSpotTypeError("");
  }, [parkingSpotType]);

  useEffect(() => {
    if (!isDataFetched) {
      const fetchData = async () => {
        const fetchedCameraData = cameras.find(camera => {
          return camera.id === cameraId;
        });

        if (fetchedCameraData) {
          setCamera(fetchedCameraData);
          setCameraName(fetchedCameraData.name);
          setCameraSource(fetchedCameraData.sourceURL);
          setParkingSpaces(fetchedCameraData.parkingSpaces);
          setCameraToken(fetchedCameraData.basicAuth);
          dispatch(
            fetchStreamPicture({
              streamUrl: fetchedCameraData.sourceURL,
              basicAuth: fetchedCameraData.basicAuth,
            })
          );
          setIsDataFetched(true);
        }
      };

      fetchData();
    }
  }, [cameraId, cameras, isDataFetched, dispatch]);

  useEffect(() => {
    if (cameraToken) {
      const decodedCredentials = window.atob(cameraToken).split(":", 2);
      const [decodedUsername, decodedPassword] = decodedCredentials;
      setAuthUsername(decodedUsername);
      setAuthPassword(decodedPassword);
    }
  }, [cameraToken]);

  const handleAuthUsernameChange = e => {
    setAuthUsername(e.target.value);
  };

  const handleAuthPasswordChange = e => {
    setAuthPassword(e.target.value);
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

  const handleDeleteParkingSpace = index => {
    const updatedParkingSpaces = [...parkingSpaces];
    updatedParkingSpaces.splice(index, 1);
    setParkingSpaces(updatedParkingSpaces);
  };

  const handleDotClick = index => {
    const updatedPolygon = [...polygon];
    updatedPolygon.splice(index, 1);
    setPolygon(updatedPolygon);
  };

  const handleSubmitUrl = () => {
    let authHeader = "";

    if (authUsername && authPassword) {
      if (/[;:,.]/.test(authUsername)) {
        setAuthUsernameError(true);
        return;
      } else {
        const combinedCredentials = `${authUsername}:${authPassword}`;
        const base64Credentials = window.btoa(combinedCredentials);

        authHeader = base64Credentials;
        setAuthUsernameError(false);
      }
    }
    dispatch(
      fetchStreamPicture({ streamUrl: cameraSource, basicAuth: authHeader })
    );
  };

  const handleStageClick = e => {
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

  const handleNameChange = (e, index) => {
    const updatedParkingSpaces = [...parkingSpaces];
    const updatedParkingSpace = {
      ...updatedParkingSpaces[index],
      name: e.target.value,
    };
    updatedParkingSpaces[index] = updatedParkingSpace;
    setParkingSpaces(updatedParkingSpaces);
  };

  const handleCameraNameChange = e => {
    setCameraName(e.target.value);
  };

  const handleCameraSourceChange = e => {
    setCameraSource(e.target.value);
  };

  const handleTypeChange = (e, index) => {
    const updatedParkingSpaces = [...parkingSpaces];
    updatedParkingSpaces[index] = {
      ...updatedParkingSpaces[index],
      type: e.target.value,
    };
    setParkingSpaces(updatedParkingSpaces);
  };

  useEffect(() => {
    if (selectedImage) {
      setOriginalImageSize({
        width: selectedImage.width,
        height: selectedImage.height,
      });
    }
  }, [selectedImage, setOriginalImageSize]);

  const handleParkingSpotSubmit = e => {
    e.preventDefault();

    if (polygon.length !== 4) {
      return;
    }

    if (parkingSpotName === "" || parkingSpotType === "") {
      if (parkingSpotName === "" && parkingSpotType === "") {
        setParkingSpotNameError("Please select parking spot name.");
        setParkingSpotTypeError("Please select parking spot type.");
      } else if (parkingSpotName === "") {
        setParkingSpotNameError("Please select parking spot name.");
      } else {
        setParkingSpotTypeError("Please select parking spot type.");
      }
      return;
    }

    const existingParkingNames = parkingSpaces.map(
      parkingSpace => parkingSpace.name
    );

    if (existingParkingNames.includes(parkingSpotName)) {
      setParkingSpotNameError("Parking spot name is already in use.");
      return;
    }

    if (!selectedImage) {
      return;
    }

    const scaledPolygon = polygon.map(point => [point[0], point[1]]);
    const newParkingSpace = {
      name: parkingSpotName,
      polygon: scaledPolygon,
      type: parkingSpotType,
    };
    setParkingSpaces([...parkingSpaces, newParkingSpace]);
    setPolygon([]);
    setParkingSpotName("");
    setParkingSpotNameError("");
    setParkingSpotTypeError("");
    setParkingSpotType("");
  };

  const handleFormSubmit = e => {
    e.preventDefault();

    if (
      cameraName === "" ||
      cameraSource === "" ||
      parkingSpaces.length === 0
    ) {
      if (cameraName === "") {
        setCameraNameError("Please enter camera name.");
      } else if (cameraSource === "") {
        setCameraSourceError("Please enter camera source URL.");
      } else if (parkingSpaces.length === 0) {
        setParkingSpacesError("Please enter at least one parking space.");
      }
      return;
    }

    const updateParkingCamera = {
      id: cameraId,
      sourceURL: cameraSource,
      name: cameraName,
      parkingSpaces,
    };

    dispatch(updateCamera(updateParkingCamera)).then(() => {
      setCameraName("");
      setCameraNameError("");
      setCameraSource("");
      setCameraSourceError("");
      setParkingSpaces([]);
      navigate("/");
    });

    navigate("/cameras");
  };

  return (
    <div>
      <Navigation />
      <Container className="my-4">
        {camera ? (
          <>
            <h3 className="mb-3">Edit Camera - {cameraName}</h3>
            {cameraNameError && (
              <ErrorMessage
                message={cameraNameError}
                onDismiss={() => setCameraNameError("")}
              />
            )}
            {cameraSourceError && (
              <ErrorMessage
                message={cameraSourceError}
                onDismiss={() => setCameraSourceError("")}
              />
            )}
            {parkingSpacesError && (
              <ErrorMessage
                message={parkingSpacesError}
                onDismiss={() => setParkingSpacesError("")}
              />
            )}
            {authUsernameError && (
              <ErrorMessage
                message={"The username contains special characters."}
                onDismiss={() => setAuthUsernameError(false)}
              />
            )}
            <form
              onSubmit={handleFormSubmit}
              className="d-flex flex-column gap-3"
            >
              <FormItem
                labelText="Parking location name"
                inputType="text"
                formId="cameraName"
                formValue={cameraName}
                handleChangeValue={handleCameraNameChange}
                addStyle={{ borderColor: cameraNameError ? "red" : "" }}
              />
              <div className="d-flex flex-column flex-md-row gap-2">
                <FormItem
                  labelText="URL for camera source"
                  inputType="text"
                  formId="cameraSource"
                  formValue={cameraSource}
                  handleChangeValue={handleCameraSourceChange}
                  addStyle={{
                    borderColor: cameraSourceError ? "red" : "",
                  }}
                />
                <FormItem
                  labelText="Username"
                  inputType="text"
                  formId="username"
                  formValue={authUsername}
                  handleChangeValue={handleAuthUsernameChange}
                  addStyle={{ borderColor: authUsernameError ? "red" : "" }}
                />
                <FormItem
                  labelText="Password"
                  inputType={showPassword ? "text" : "password"}
                  formId="password"
                  formValue={authPassword}
                  handleChangeValue={handleAuthPasswordChange}
                  // addStyle={{ borderColor: cameraSourceError ? "red" : "inherit" }}
                />
                <Form.Check
                  type="checkbox"
                  id="default-checkbox"
                  label="Show password"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => {
                    handleSubmitUrl();
                  }}
                  className="py-2"
                >
                  Fetch Picture
                </Button>
              </div>
              {cameraStatus === "loading" && <SpinnerItem />}
              {cameraStatus === "succeeded" && cameraError && (
                <ErrorMessage
                  message={cameraErrorMessage}
                  onDismiss={() => dispatch(dismissFetchStreamPictureError())}
                />
              )}
              {selectedImage !== null && (
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
                          {parkingSpaces?.map(parkingSpace => {
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
                                onDragMove={e => handleDragMove(index, e)}
                              />
                            );
                          })}
                        </Group>
                      )}
                  </Layer>
                </Stage>
              )}
              {parkingSpotNameError && (
                <ErrorMessage
                  message={parkingSpotNameError}
                  onDismiss={() => setParkingSpotNameError("")}
                />
              )}
              {parkingSpotTypeError && (
                <ErrorMessage
                  message={parkingSpotTypeError}
                  onDismiss={() => setParkingSpotTypeError("")}
                />
              )}
              {polygon.length === 4 && (
                <ParkingSpaceInput
                  parkingSpace={{
                    parkingSpotName,
                  }}
                  isEditing={false}
                  setParkingType={setParkingSpotType}
                  handleNameChange={e => setParkingSpotName(e.target.value)}
                  handleParkingSpotSubmit={handleParkingSpotSubmit}
                />
              )}
              {parkingSpaces?.map((parkingSpace, index) => {
                const allParkingTypes = ["normal", "disabled", "reserved"];
                const parkingTypeOptions = allParkingTypes.filter(
                  option => option !== parkingSpace.type
                );
                return (
                  <ParkingSpaceInput
                    key={parkingSpace.name}
                    parkingSpace={parkingSpace}
                    parkingTypeOptions={parkingTypeOptions}
                    index={index}
                    isEditing={true}
                    handleNameChange={handleNameChange}
                    handleTypeChange={handleTypeChange}
                    handleDeleteParkingSpace={handleDeleteParkingSpace}
                  />
                );
              })}
              <Button variant="primary" type="submit">
                Update
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  dispatch(removeFetchedStreamPicture());
                  navigate("/cameras");
                }}
              >
                Cancel
              </Button>
            </form>
          </>
        ) : (
          <SpinnerItem />
        )}
      </Container>
    </div>
  );
};

export default EditCamera;
