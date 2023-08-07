import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import ParkingSpot from "./ParkingSpot";
import { Stage, Layer } from "react-konva";
var _ = require("lodash");

const ParkingCamera = ({ camera, currentImage, parkingLocations }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [originalImageSize, setOriginalImageSize] = useState({
    width: 0,
    height: 0,
  });

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
    // Extract width and height of the original image
    if (currentImage) {
      const img = new window.Image();
      img.src = `data:image/png;base64, ${currentImage}`;
      img.onload = () => {
        setOriginalImageSize({ width: img.width, height: img.height });
      };
    }
  }, [currentImage]);

  const freeParkingSpaces = _.size(
    _.filter(parkingLocations, (parkingLocation) => !parkingLocation.occupied)
  );
  const takenParkingSpaces = _.size(
    _.filter(parkingLocations, (parkingLocation) => parkingLocation.occupied)
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

      <div
        style={{ width: imageSize.width, height: imageSize.height }}
        className="ratio ratio-16x9 mb-2"
      >
        {currentImage && (
          <Image
            src={`data:image/png;base64, ${currentImage}`}
            alt="Parking lot feed"
            style={{ width: "100%", height: "100%" }}
          />
        )}
        {originalImageSize.width !== 0 && originalImageSize.height !== 0 && (
          <Stage width={imageSize.width} height={imageSize.height}>
            <Layer>
              {_.map(parkingLocations, (parkingLocation) => {
                const originalParkingSpot = parkingLocation.polygon;
                // Calculate the dynamic scaleX and scaleY values based on the original image size
                const scaleX =
                  originalImageSize.width !== 0
                    ? imageSize.width / originalImageSize.width
                    : 1;
                const scaleY =
                  originalImageSize.height !== 0
                    ? imageSize.height / originalImageSize.height
                    : 1;
                const scaledParkingSpot = originalParkingSpot.map(([x, y]) => [
                  x * scaleX,
                  y * scaleY,
                ]);
                const parkingSpots = {
                  name: parkingLocation.name,
                  occupied: parkingLocation.occupied,
                  flattenedParkingSpot: _.flatten(scaledParkingSpot),
                };

                return (
                  <ParkingSpot
                    key={parkingSpots.name}
                    parkingSpot={parkingSpots}
                    scaleX={scaleX * 2}
                    scaleY={scaleY * 2}
                  />
                );
              })}
            </Layer>
          </Stage>
        )}
      </div>
    </React.Fragment>
  );
};

export default ParkingCamera;
