// react imports
import React from "react";

// library imports
import { Line, Text } from "react-konva";

const ParkingSpot = ({ parkingSpot }) => {
  return (
    <>
      <Text
        text={`${parkingSpot.name} - ${parkingSpot.occupied}`}
        fontSize={16}
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
      />
    </>
  );
};

export default ParkingSpot;
