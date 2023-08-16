import Spinner from "react-bootstrap/Spinner";

const SpinnerItem = (props) => {
  return (
    <Spinner animation="border" role="status" size={props.spinnerSize}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default SpinnerItem;
