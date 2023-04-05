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

const Login = () => {
  const [formEmailInput, setFormEmailInput] = useState("");
  const [formPasswordInput, setFormPasswordInput] = useState("");
  const error = useSelector(state => state.user.error);
  const errorMessage = useSelector(state => state.user.message);
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
  const postStatus = useSelector(state => state.user.status);
  if (postStatus === "failed") {
    content = `Error: ${error}`;
  } else if (postStatus === "succeeded" && error) {
    content = `Error: ${errorMessage}`;
  }

  useEffect(() => {
    if (postStatus === "succeeded" && !error) {
      navigate("/");
    }
  }, [postStatus, navigate, error]);

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
                        postStatus === "loading" &&
                        postStatus === "succeeded" &&
                        true
                      }
                    >
                      {postStatus === "loading" ? "Loading..." : "Login"}
                    </Button>
                    {postStatus !== "loading" && postStatus !== "succeeded" && (
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
