// react imports
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

// bootstrap imports
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// store imports
import { LOGOUT } from "../store/user/authSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(LOGOUT());
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Parking App</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
            <Nav.Link as={Link} onClick={logoutHandler}>
              Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
