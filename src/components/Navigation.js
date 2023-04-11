// react imports
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// bootstrap imports
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// store imports
import { LOGOUT } from "../store/user/userSlice";
import { REMOVE_DATA } from "../store/camera/cameraSlice";

const Navigation = props => {
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(REMOVE_DATA());
    dispatch(LOGOUT());
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  let content;
  if (props.token && !redirect) {
    content = (
      <>
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
        <Nav.Link as={Link} to="/profile">
          Profile
        </Nav.Link>
        <Nav.Link as={Link} onClick={logoutHandler}>
          Logout
        </Nav.Link>
      </>
    );
  } else {
    content = (
      <>
        <Nav.Link as={Link} to="/login">
          Login
        </Nav.Link>
        <Nav.Link as={Link} to="/register">
          Register
        </Nav.Link>
      </>
    );
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" style={{ height: "8dvh" }}>
        <Container>
          <Navbar.Brand>Parking API</Navbar.Brand>
          <Nav>{content}</Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
