// react imports
import React from "react";

// library imports
import { Line, Text } from "react-konva";

const ParkingSpot = ({ parkingSpot, scaleX, scaleY }) => {
  const actualLineWidth = 2 / Math.min(scaleX, scaleY);
  const actualFontSize = 16 / Math.min(scaleX, scaleY);

  return (
    <>
      <Text
        text={`${parkingSpot.name} - ${parkingSpot.occupied}`}
        fontSize={actualFontSize}
        fill={parkingSpot.occupied ? "red" : "green"}
        x={
          (parkingSpot.flattenedParkingSpot[0] +
            parkingSpot.flattenedParkingSpot[2]) /
          2
        }
        y={
          (parkingSpot.flattenedParkingSpot[1] +
            parkingSpot.flattenedParkingSpot[3]) /
          2
        }
      />
      <Line
        points={parkingSpot.flattenedParkingSpot}
        closed
        stroke={parkingSpot.occupied ? "red" : "green"}
        strokeWidth={actualLineWidth}
      />
    </>
  );
};

export default ParkingSpot;
