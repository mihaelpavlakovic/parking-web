// react imports
import React, { useEffect, useState } from "react";

// component imports
import { Button, Container, Form } from "react-bootstrap";
import { Stage, Layer, Circle, Image, Group } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { addCamera, fetchStreamPicture } from "../store/camera/cameraActions";
import FormItem from "../utils/FormItem";
import { useNavigate } from "react-router-dom";
import ParkingSpot from "../utils/ParkingSpot";
import _ from "lodash";
import useImageScaler from "../hooks/useImageScaler";
import useImageSelector from "../hooks/useImageSelector";
import { calculateScaledPoint } from "../utils";
import ParkingSpaceInput from "../utils/ParkingSpaceInput";
import {
  dismissFetchStreamPictureError,
  selectFetchStreamPictureError,
  selectFetchStreamPictureStatus,
  selectFetchStreamResponseError,
  selectStreamPicture,
} from "../store/camera/cameraSlice";
import SpinnerItem from "../utils/SpinnerItem";
import ErrorMessage from "../components/ErrorMessage";

const NewCamera = ({ handleCancel }) => {
  const streamPicture = useSelector(selectStreamPicture);
  const [polygon, setPolygon] = useState([]);
  const [parkingSpotName, setParkingSpotName] = useState("");
  const [parkingSpotNameError, setParkingSpotNameError] = useState("");
  const [parkingSpotType, setParkingSpotType] = useState("");
  const [parkingSpotTypeError, setParkingSpotTypeError] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [cameraNameError, setCameraNameError] = useState("");
  const [cameraSource, setCameraSource] = useState("");
  const [cameraSourceError, setCameraSourceError] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [authUsername, setAuthUsername] = useState("");
  const [authUsernameError, setAuthUsernameError] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [parkingSpacesError, setParkingSpacesError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedImage } = useImageSelector(streamPicture);
  const { imageSize, originalImageSize, setOriginalImageSize } =
    useImageScaler();
  const cameraStatus = useSelector(selectFetchStreamPictureStatus);
  const cameraError = useSelector(selectFetchStreamResponseError);
  const cameraErrorMessage = useSelector(selectFetchStreamPictureError);
  const [isChecked, setIsChecked] = useState(false);
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
    if (selectedImage) {
      setOriginalImageSize({
        width: selectedImage.width,
        height: selectedImage.height,
      });
    }
  }, [selectedImage, setOriginalImageSize]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
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

  const handleDotClick = index => {
    const updatedPolygon = [...polygon];
    updatedPolygon.splice(index, 1);
    setPolygon(updatedPolygon);
  };

  const handleNameChange = e => {
    setParkingSpotName(e.target.value);
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

  const handleDeleteParkingSpace = index => {
    const updatedParkingSpaces = [...parkingSpaces];
    updatedParkingSpaces.splice(index, 1);
    setParkingSpaces(updatedParkingSpaces);
  };

  const handleResetParkingSpaces = () => {
    setParkingSpaces([]);
  };

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

  useEffect(() => {
    if (selectedImage) {
      setOriginalImageSize({
        width: selectedImage.width,
        height: selectedImage.height,
      });
    }
  }, [selectedImage, setOriginalImageSize]);

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

    let authHeader = "";

    if (authUsername && authPassword) {
      const combinedCredentials = `${authUsername}:${authPassword}`;
      const base64Credentials = window.btoa(combinedCredentials);

      authHeader = base64Credentials;
    }

    const createParkingCamera = {
      name: cameraName,
      sourceURL: cameraSource,
      parkingSpaces,
      basicAuth: authHeader,
    };
    console.log("handleFormSubmit ~ createParkingCamera:", createParkingCamera);

    dispatch(addCamera(createParkingCamera)).then(() => {
      setCameraName("");
      setCameraNameError("");
      setCameraSource("");
      setCameraSourceError("");
      setParkingSpaces([]);
      navigate("/");
    });
  };

  return (
    <Container>
      <h3 className="mb-3">Add new camera:</h3>
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
      <form onSubmit={handleFormSubmit} className="d-flex flex-column gap-3">
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
            addStyle={{ borderColor: cameraSourceError ? "red" : "" }}
          />
          <Form.Check
            type="checkbox"
            id="auth-checkbox"
            label="Authorization"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          {isChecked && (
            <>
              <FormItem
                labelText="Username"
                inputType="text"
                formId="username"
                formValue={authUsername}
                handleChangeValue={handleAuthUsernameChange}
                addStyle={{
                  borderColor: authUsernameError ? "red" : "inherit",
                }}
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
                id="password-checkbox"
                label="Show password"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
            </>
          )}
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => {
              handleResetParkingSpaces();
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
        {selectedImage !== null && cameraStatus !== "loading" && (
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
              onTap={handleStageClick}
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
                            onTap={() => handleDotClick(index)}
                            draggable
                            onDragMove={e => handleDragMove(index, e)}
                          />
                        );
                      })}
                    </Group>
                  )}
              </Layer>
            </Stage>
          </div>
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
          <div className="d-flex flex-column flex-md-row gap-2">
            <FormItem
              labelText="Name parking space"
              inputType="text"
              formId="name"
              formValue={parkingSpotName}
              handleChangeValue={handleNameChange}
              addStyle={{
                borderColor: parkingSpotNameError ? "red" : "initial",
              }}
            />
            <Form.Select
              label="Parking space type:"
              onChange={e => setParkingSpotType(e.target.value)}
              className={parkingSpotTypeError ? "border-danger" : ""}
            >
              <option value="">Select Type</option>
              <option value="normal">normal</option>
              <option value="disabled">disabled</option>
              <option value="reserved">reserved</option>
            </Form.Select>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={handleParkingSpotSubmit}
            >
              Submit
            </Button>
          </div>
        )}
        {parkingSpaces.length !== 0 && (
          <div className="d-flex flex-column gap-2">
            {parkingSpaces.map((parkingSpace, index) => {
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
          </div>
        )}

        <Button type="submit" variant="primary" className="py-2">
          Submit
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="mb-5 py-2"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </form>
    </Container>
  );
};

export default NewCamera;
