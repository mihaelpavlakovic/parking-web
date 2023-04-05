// react imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// bootstrap imports
import { Container, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

// component imports
import Navigation from "../components/Navigation";
import CardItem from "../utils/CardItem";
import FormItem from "../utils/FormItem";
import backgroundImage from "../assets/parking-background.png";

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
    content = `Error: ${serverResponseError}`;
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
      <Navigation />
      <main
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <Container style={{ height: "94dvh" }}>
          <div className="row h-100">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 m-auto">
              <CardItem
                title="Login"
                subtitle="Please login to proceed to the dashboard"
                text=""
              >
                {content && (
                  <Alert variant="danger">
                    <span>{content}</span>
                  </Alert>
                )}
                <form onSubmit={handleSubmit}>
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
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={
                        tokenRequestStatus === "loading" &&
                        tokenRequestStatus === "succeeded" &&
                        true
                      }
                    >
                      {tokenRequestStatus === "loading"
                        ? "Loading..."
                        : "Login"}
                    </Button>
                    {tokenRequestStatus !== "loading" &&
                      tokenRequestStatus !== "succeeded" && (
                        <Button
                          type="button"
                          variant="outline-primary"
                          size="md"
                          onClick={resetHandler}
                        >
                          Reset
                        </Button>
                      )}
                  </div>
                </form>
              </CardItem>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
};

export default Login;
