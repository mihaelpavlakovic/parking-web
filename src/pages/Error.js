// react imports
import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div>
      <p>{error.message || error.statusText}</p>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Return
      </button>
    </div>
  );
};

export default Error;
