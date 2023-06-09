import React from "react";

const FormItem = props => {
  return (
    <div className="form-floating">
      {props.inputType !== "file" ? (
        <>
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
              ...props.addStyle,
            }}
            accept={props.acceptValue}
          />
          <label htmlFor={props.formId}>{props.labelText}</label>
        </>
      ) : (
        <div
          className="d-flex flex-column flex-md-row align-items-start align-items-md-center py-3 px-3"
          style={{
            borderRadius: "10px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.25)",
            ...props.addStyle,
          }}
        >
          <label
            htmlFor={props.formId}
            style={{
              marginRight: "10px",
            }}
          >
            {props.labelText}
          </label>
          <div className="flex-grow-1">
            <input
              type="file"
              className="form-control-file w-100"
              id={`${props.formId}-file`}
              accept={props.acceptValue}
              onChange={props.handleChangeValue}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormItem;
