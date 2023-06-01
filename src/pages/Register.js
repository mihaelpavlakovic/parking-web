// react imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// bootstrap imports
import { Container, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

// component imports
import FormItem from "../utils/FormItem";
import SpinnerItem from "../utils/SpinnerItem";

// store imports
import {
  selectServerResponseError,
  selectServerResponseMessage,
  selectTokenRequestStatus,
} from "../store/user/userSlice";
import { register } from "../store/user/userActions";

const Register = () => {
  const [formEmailInput, setFormEmailInput] = useState("");
  const [formPasswordInput, setFormPasswordInput] = useState("");
  const [formPasswordConfirmInput, setFormPasswordConfirmInput] = useState("");
  const [error, setError] = useState("");
  const serverResponseError = useSelector(selectServerResponseError);
  const serverResponseMessage = useSelector(selectServerResponseMessage);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetHandler = () => {
    setFormEmailInput("");
    setFormPasswordInput("");
    setFormPasswordConfirmInput("");
  };

  const handleEmailChange = event => {
    setFormEmailInput(event.target.value);
  };

  const handlePasswordChange = event => {
    setFormPasswordInput(event.target.value);
  };

  const handlePasswordConfirmChange = event => {
    setFormPasswordConfirmInput(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (formPasswordInput !== formPasswordConfirmInput) {
      // Passwords don't match, return an error
      setError("Passwords must match.");
      return;
    }

    dispatch(register({ email: formEmailInput, password: formPasswordInput }));
    resetHandler();
  };

  let content;
  const tokenRequestStatus = useSelector(selectTokenRequestStatus);
  if (tokenRequestStatus === "failed") {
    content = `Error: ${serverResponseMessage}`;
  } else if (tokenRequestStatus === "succeeded" && serverResponseError) {
    content = `Error: ${serverResponseMessage}`;
  } else if (error) {
    content = error;
  }

  useEffect(() => {
    if (tokenRequestStatus === "succeeded" && !serverResponseError) {
      navigate("/");
    }
  }, [tokenRequestStatus, navigate, serverResponseError]);

  return (
    <>
      <main style={{ backgroundColor: "#e1e1e1" }}>
        <Container
          style={{ height: "100vh" }}
          className="d-flex align-items-center justify-content-center"
        >
          <div
            className="row w-100"
            style={{ filter: "drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.14))" }}
          >
            <div
              className="col-12 col-md-12 col-lg-6 px-5 py-4 mx-auto"
              style={{ backgroundColor: "#7495FF", borderRadius: "10px" }}
            >
              <div className="h-100 d-flex flex-column justify-content-center gap-2">
                <div>
                  <h1
                    className="text-white fw-bold"
                    style={{ fontFamily: "Fira Sans", fontSize: "48px" }}
                  >
                    Parking API
                  </h1>
                  <p
                    className="text-white fw-normal fst-italic"
                    style={{
                      fontFamily: "Fira Sans",
                      fontSize: "16px",
                    }}
                  >
                    Create new account to start your ParKing experience.
                  </p>
                </div>
                <div className="d-flex flex-column gap-2">
                  {content && (
                    <Alert variant="danger">
                      <span>{content}</span>
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit}>
                    <h2
                      className="text-white fw-normal"
                      style={{
                        fontFamily: "Chivo",
                        fontSize: "32px",
                      }}
                    >
                      Register
                    </h2>
                    <div className="d-flex flex-column">
                      <FormItem
                        labelText="Enter email"
                        inputType="email"
                        formId="emailInput"
                        formValue={formEmailInput}
                        handleChangeValue={handleEmailChange}
                      />
                      <FormItem
                        labelText="Enter password"
                        inputType="password"
                        formId="passwordInput"
                        formValue={formPasswordInput}
                        handleChangeValue={handlePasswordChange}
                      />
                      <FormItem
                        labelText="Confirm password"
                        inputType="password"
                        formId="passwordConfirmInput"
                        formValue={formPasswordConfirmInput}
                        handleChangeValue={handlePasswordConfirmChange}
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={
                          tokenRequestStatus === "loading" &&
                          tokenRequestStatus === "succeeded" &&
                          true
                        }
                        className="align-self-start w-100 w-lg-25 text-uppercase fw-bold border-0 btn"
                        style={{
                          backgroundColor: "#43cd99",
                          borderRadius: "10px",
                          fontFamily: "Chivo",
                          padding: "15px",
                          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {tokenRequestStatus === "loading" ? (
                          <>
                            <SpinnerItem spinnerSize="sm" />
                            <span className="ps-2">Loading...</span>
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </div>
                  </form>
                  <p
                    className="text-white fw-light mt-4"
                    style={{ fontFamily: "Chivo", color: "#fcfcfc" }}
                  >
                    Already have an account? Login{" "}
                    <Link
                      className="link"
                      to="/login"
                      style={{ color: "#fcfcfc" }}
                    >
                      here
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
};

export default Register;
