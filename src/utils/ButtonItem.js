// react imports
import React from "react";

// bootstrap imports
import Button from "react-bootstrap/Button";

const ButtonItem = props => {
  return (
    <>
      <Button
        variant={props.btnVariant}
        type={props.btnAction}
        size={props.btnSize}
      >
        {props.text}
      </Button>
    </>
  );
};

export default ButtonItem;
