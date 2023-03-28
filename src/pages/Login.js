// react imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// bootstrap imports
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

// component imports
import Navigation from "../components/Navigation";
import CardItem from "../utils/CardItem";
import FormItem from "../utils/FormItem";

// store imports
import { login } from "../store/user/userActions";

const Login = () => {
  const [formEmailInput, setFormEmailInput] = useState("");
  const [formPasswordInput, setFormPasswordInput] = useState("");
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
  if (postStatus === "loading") {
    content = "Loading...";
  } else if (postStatus === "failed") {
    content = "Error";
  }

  useEffect(() => {
    if (postStatus === "succeeded") {
      navigate("/");
    }
  }, [postStatus, navigate]);

  return (
    <>
      <Navigation />
      <main>
        <Container>
          <h1>Login</h1>
          <p>{content}</p>
          <CardItem
            title="Login"
            subtitle="Please login to proceed to the dashboard"
            text=""
          >
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
                  disabled={postStatus === "loading" && true}
                >
                  {postStatus === "loading" ? content : "Login"}
                </Button>
                {postStatus !== "loading" && (
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
        </Container>
      </main>
    </>
  );
};

export default Login;
