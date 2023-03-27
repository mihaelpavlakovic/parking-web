// react imports
import React, { useState } from "react";

// bootstrap imports
import { Container, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
// import Button from "react-bootstrap";

// component imports
import Navigation from "../components/Navigation";
import CardItem from "../utils/CardItem";
import FormItem from "../utils/FormItem";
// import ButtonItem from "../utils/ButtonItem";

// store imports
import { login } from "../store/user/userActions";

const Login = () => {
  const [formEmailInput, setFormEmailInput] = useState("");
  const [formPasswordInput, setFormPasswordInput] = useState("");
  const dispatch = useDispatch();

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
  return (
    <>
      <Navigation />
      <main>
        <Container>
          <h1>Login</h1>
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
              <Button type="submit" variant="primary" size="md">
                Login
              </Button>
              <Button
                type="button"
                variant="outline-primary"
                size="md"
                onClick={resetHandler}
              >
                Reset
              </Button>
            </form>
          </CardItem>
        </Container>
      </main>
    </>
  );
};

export default Login;
