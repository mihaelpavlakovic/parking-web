import Modal from "react-bootstrap/Modal";

const ModalItem = props => {
  return (
    <Modal show={props.modalShow} onHide={props.handleClose}>
      {props.modalTitle !== "" && (
        <Modal.Header>
          <Modal.Title>{props.modalTitle}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="mx-auto">{props.children}</Modal.Body>
    </Modal>
  );
};

export default ModalItem;
