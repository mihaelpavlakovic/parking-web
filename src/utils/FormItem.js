import React from "react";

const FormItem = props => {
  return (
    <>
      <div className="form-floating mb-3">
        <input
          type={props.inputType}
          className="form-control"
          id={props.formId}
          placeholder={props.labelText}
          value={props.formValue}
          onChange={props.handleChangeValue}
          style={{
            borderRadius: "10px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.25)",
          }}
        />
        <label htmlFor={props.formId}>{props.labelText}</label>
      </div>
    </>
  );
};

export default FormItem;
