// react imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// bootstrap imports
import { Container, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

// component imports
import FormItem from "../utils/FormItem";
import parkingLot from "../assets/parking-lot.svg";
import SpinnerItem from "../utils/SpinnerItem";

// store imports
import { login } from "../store/user/userActions";
import {
  selectServerResponseError,
  selectServerResponseMessage,
  selectTokenRequestStatus,
} from "../store/user/userSlice";

const Login = () => {
  const [formEmailInput, setFormEmailInput] = useState("");
  const [formPasswordInput, setFormPasswordInput] = useState("");
  const serverResponseError = useSelector(selectServerResponseError);
  const serverResponseMessage = useSelector(selectServerResponseMessage);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetHandler = () => {
    setFormEmailInput("");
    setFormPasswordInput("");
  };

  const handleEmailChange = event => {
    setFormEmailInput(event.target.value);
  };

  const handlePasswordChange = event => {
    setFormPasswordInput(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    dispatch(login({ email: formEmailInput, password: formPasswordInput }));

    resetHandler();
  };

  let content;
  const tokenRequestStatus = useSelector(selectTokenRequestStatus);
  if (tokenRequestStatus === "failed") {
    content = `Error: ${serverResponseMessage}`;
  } else if (tokenRequestStatus === "succeeded" && serverResponseError) {
    content = `Error: ${serverResponseMessage}`;
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
              className="d-none d-lg-block col-lg-6"
              style={{
                backgroundColor: "#C0C0C0",
                overflow: "hidden",
                borderRadius: "10px 0 0 10px",
                marginRight: "-10px",
              }}
            >
              <img src={parkingLot} alt="Parking" className="h-100 w-110" />
            </div>
            <div
              className="col-12 col-md-12 col-lg-6 px-5 py-4"
              style={{ backgroundColor: "#7495FF", borderRadius: "10px" }}
            >
              <div className="h-100 d-flex flex-column justify-content-center gap-5">
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
                    "Park smart. Park with ParKing."
                  </p>
                </div>
                <div className="d-flex flex-column gap-4">
                  {content && (
                    <Alert variant="danger">
                      <span>{content}</span>
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit}>
                    <h2
                      className="text-white fw-normal mb-3"
                      style={{
                        fontFamily: "Chivo",
                        fontSize: "32px",
                      }}
                    >
                      Login
                    </h2>
                    <div className="d-flex flex-column gap-3">
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
                          "Login"
                        )}
                      </Button>
                    </div>
                  </form>
                  <p
                    className="text-white fw-light"
                    style={{ fontFamily: "Chivo", color: "#fcfcfc" }}
                  >
                    Need an account? Register{" "}
                    <Link
                      className="link"
                      to="/register"
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

export default Login;
