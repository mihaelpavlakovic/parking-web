// react imports
import React from "react";

// library imports
import { Line, Text } from "react-konva";

const ParkingSpot = ({ parkingSpot }) => {
  const [x1, y1, x2, y2, x3, y3, x4, y4] = parkingSpot.flattenedParkingSpot;

  const centerX = (x1 + x2 + x3 + x4) / 4;
  const centerY = (y1 + y2 + y3 + y4) / 4;
  return (
    <>
      <Text
        text={`${parkingSpot.name}`}
        fontSize={16}
        fill={parkingSpot.occupied ? "red" : "green"}
        x={centerX}
        y={centerY}
      />
      <Line
        points={parkingSpot.flattenedParkingSpot}
        closed
        stroke={parkingSpot.occupied ? "red" : "green"}
        strokeWidth={3}
      />
    </>
  );
};

export default ParkingSpot;
