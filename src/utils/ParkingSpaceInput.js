import { Button, Form } from "react-bootstrap";
import FormItem from "./FormItem";

const ParkingSpaceInput = ({
  parkingSpace,
  parkingTypeOptions,
  index,
  isEditing,
  setParkingType,
  handleNameChange,
  handleTypeChange,
  handleParkingSpotSubmit,
  handleDeleteParkingSpace,
}) => {
  return (
    <div className="d-flex flex-column flex-md-row gap-2">
      <FormItem
        labelText="Name parking space"
        inputType="text"
        formId={`name-${index}`}
        formValue={parkingSpace?.name}
        handleChangeValue={(e) => handleNameChange(e, index)}
      />
      {!isEditing && (
        <>
          <Form.Select
            label="Parking space type:"
            onChange={(e) => setParkingType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="normal">normal</option>
            <option value="disabled">disabled</option>
            <option value="reserved">reserved</option>
          </Form.Select>
          <Button
            type="button"
            variant="secondary"
            onClick={handleParkingSpotSubmit}
          >
            Submit
          </Button>
        </>
      )}
      {isEditing && (
        <>
          <Form.Select
            value={parkingSpace.type}
            onChange={(e) => handleTypeChange(e, index)}
          >
            <option value={parkingSpace.type}>{parkingSpace.type}</option>
            {parkingTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
          <Button
            variant="outline-danger"
            onClick={() => {
              handleDeleteParkingSpace(index);
            }}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default ParkingSpaceInput;
