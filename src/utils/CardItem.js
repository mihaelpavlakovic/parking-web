// react imports
import React from "react";

// bootstrap imports
import Card from "react-bootstrap/Card";

const CardItem = props => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {props.subtitle}
        </Card.Subtitle>
        <Card.Text>{props.text}</Card.Text>
        <>{props.children}</>
      </Card.Body>
    </Card>
  );
};

export default CardItem;
