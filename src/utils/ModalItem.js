import Modal from "react-bootstrap/Modal";
import FormItem from "../utils/FormItem";
import { Circle, Group, Image, Layer, Stage } from "react-konva";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import _ from "lodash";
import ParkingSpot from "./ParkingSpot";
import { useDispatch } from "react-redux";
import { updateCamera } from "../store/camera/cameraActions";

const ModalItem = ({ modalShow, handleClose, modalTitle, camera }) => {
  const [polygon, setPolygon] = useState([]);
  const [name, setName] = useState("");
  const [cameraName, setCameraName] = useState(camera?.name);
  const [cameraSource, setCameraSource] = useState(camera?.sourceURL);
  const [parkingSpaces, setParkingSpaces] = useState(camera?.parkingSpaces);
  const [error, setError] = useState("");
  const [imageObj, setImageObj] = useState(null);
  const [modalWidth, setModalWidth] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadImage = () => {
      const image = new window.Image();
      image.src = camera?.sourceURL;

      image.onload = () => {
        setImageObj(image);
      };
    };

    if (camera?.sourceURL) {
      loadImage();
    }
  }, [camera?.sourceURL]);

  useEffect(() => {
    const handleResize = () => {
      const modalElement = document.getElementById("modal-body");
      if (modalElement) {
        setModalWidth(modalElement.clientWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDeleteParkingSpace = index => {
    const updatedParkingSpaces = [...parkingSpaces];
    updatedParkingSpaces.splice(index, 1);
    setParkingSpaces(updatedParkingSpaces);
  };

  // Calculate the size of the image based on the modal width
  const calculateImageSize = () => {
    if (modalWidth < 430) {
      return { x: 320, y: 180 };
    } else if (modalWidth < 750) {
      return { x: 426, y: 240 };
    } else if (modalWidth < 1000) {
      return { x: 640, y: 360 };
    } else if (modalWidth < 1400) {
      return { x: 854, y: 480 };
    } else {
      return { x: 1280, y: 720 };
    }
  };

  const imageSize = calculateImageSize();
  const scaleX = imageSize.x / 640;
  const scaleY = imageSize.y / 360;

  const handleDotClick = index => {
    const updatedPolygon = [...polygon];
    updatedPolygon.splice(index, 1);
    setPolygon(updatedPolygon);
  };

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

  const handleSubmission = e => {
    e.preventDefault();

    if (polygon.length === 4) {
      if (name !== "") {
        const existingParkingNames = parkingSpaces.map(
          parkingSpace => parkingSpace.name
        );
        if (existingParkingNames.includes(name)) {
          setError("Parking spot name is already in use.");
        } else {
          const scaledPolygon = polygon.map(point => [
            Math.round(point[0] / scaleX),
            Math.round(point[1] / scaleY),
          ]);
          const newParkingSpace = { name, polygon: scaledPolygon };
          setParkingSpaces([...parkingSpaces, newParkingSpace]);
          setPolygon([]);
          setName("");
          setError("");
        }
      } else {
        setError("Please enter parking spot name.");
      }
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

  const handleSubmit = e => {
    e.preventDefault();

    dispatch(
      updateCamera({
        id: camera.id,
        sourceURL: cameraSource,
        name: cameraName,
        parkingSpaces,
      })
    );
    console.log("submited");
    handleClose(false);
  };

  return (
    <Modal show={modalShow} onHide={handleClose}>
      {modalTitle !== "" && (
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="mx-auto w-100" id="modal-body">
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
            width={imageSize.x}
            height={imageSize.y}
            scaleX={scaleX}
            scaleY={scaleY}
            onClick={handleStageClick}
          >
            <Layer>
              {imageObj && (
                <Image
                  image={imageObj}
                  style={{
                    width: `${imageSize.x}px`,
                    height: `${imageSize.y}px`,
                  }}
                />
              )}
              {parkingSpaces?.map(parkingSpace => {
                const flattenedParkingSpot = _.flatten(parkingSpace.polygon);
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
          {error && <p className="text-danger">{error}</p>}
          {polygon.length === 4 && (
            <div className="d-flex gap-2">
              <FormItem
                labelText="Name parking space"
                inputType="text"
                formId="name"
                formValue={name}
                handleChangeValue={e => setName(e.target.value)}
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
          {parkingSpaces?.map((parkingSpace, index) => (
            <div className="d-flex gap-2" key={index}>
              <FormItem
                labelText="Name parking space"
                inputType="text"
                formId={`name-${index}`}
                formValue={parkingSpace?.name}
                handleChangeValue={e => handleNameChange(e, index)}
              />
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteParkingSpace(index);
                  console.log("deleted parking spot");
                }}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button variant="primary" type="submit">
            Update
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalItem;
