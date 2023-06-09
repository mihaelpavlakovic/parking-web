// react imports
import React, { useEffect, useState } from "react";

// bootstrap imports
import { Image } from "react-bootstrap";

// component imports
import ParkingSpot from "./ParkingSpot";

// library imports
import { Stage, Layer } from "react-konva";
var _ = require("lodash");

const ParkingCamera = ({ camera, currentImage, parkingLocations }) => {
  const [size, setSize] = useState({ x: null, y: null });
  useEffect(() => {
    const handleResize = () => {
      const innerWidth = window.innerWidth;
      if (innerWidth < 430) {
        setSize({ x: 320, y: 180 });
      } else if (innerWidth > 430 && innerWidth < 750) {
        setSize({ x: 426, y: 240 });
      } else if (innerWidth > 750 && innerWidth < 1000) {
        setSize({ x: 640, y: 360 });
      } else if (innerWidth > 1000 && innerWidth < 1400) {
        setSize({ x: 854, y: 480 });
      } else if (innerWidth > 1400) {
        setSize({ x: 1280, y: 720 });
      }
    };

    if (size.x === null) {
      handleResize();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [size.x]);

  const scaleX = size.x / 640;
  const scaleY = size.y / 360;

  const freeParkingSpaces = _.size(
    _.filter(parkingLocations, parkingLocation => !parkingLocation.occupied)
  );
  const takenParkingSpaces = _.size(
    _.filter(parkingLocations, parkingLocation => parkingLocation.occupied)
  );

  return (
    <React.Fragment>
      <h4 className="fw-normal" style={{ fontFamily: "Chivo" }}>
        {camera?.name}
      </h4>

      <div className="d-flex gap-4 text-center text-md-start">
        <p>Parking spaces: {parkingLocations.length}</p>
        <p>Free spaces: {freeParkingSpaces}</p>
        <p>Spaces taken: {takenParkingSpaces}</p>
      </div>

      <div className="ratio ratio-16x9 mb-2">
        <Image
          style={{ width: `${size.x}px`, height: `${size.y}px` }}
          src={`data:image/png;base64, ${currentImage}`}
          alt="Parking lot feed"
        />
        <Stage width={size.x} height={size.y} scaleX={scaleX} scaleY={scaleY}>
          <Layer>
            {_.map(parkingLocations, parkingLocation => {
              const flattenedParkingSpot = _.flatten(parkingLocation.polygon);
              const parkingSpots = {
                name: parkingLocation.name,
                occupied: parkingLocation.occupied,
                flattenedParkingSpot,
              };
              return (
                <ParkingSpot
                  key={parkingSpots.name}
                  parkingSpot={parkingSpots}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </React.Fragment>
  );
};

export default ParkingCamera;
