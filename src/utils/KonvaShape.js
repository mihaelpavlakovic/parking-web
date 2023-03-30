// react imports
import React from "react";

// library imports
import { Stage, Layer, Line } from "react-konva";

const KonvaShape = props => {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Line points={props.polygon} closed stroke="green" />
      </Layer>
    </Stage>
  );
};

export default KonvaShape;
