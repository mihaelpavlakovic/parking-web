// react imports
import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// bootstrap imports
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// store imports
import { LOGOUT } from "../store/user/userSlice";
import { REMOVE_DATA } from "../store/camera/cameraSlice";

const Navigation = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
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
  if (token && !redirect) {
    content = (
      <>
        <Nav.Link
          style={{
            fontWeight: location.pathname === "/" ? "700" : "",
          }}
          as={Link}
          to="/"
        >
          Home
        </Nav.Link>
        <Nav.Link
          style={{
            fontWeight: location.pathname === "/profile" ? "700" : "",
          }}
          as={Link}
          to="/profile"
        >
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
        <Nav.Link
          className="link text-white"
          style={{
            fontWeight: location.pathname === "/login" ? "700" : "",
          }}
          as={Link}
          to="/login"
        >
          Login
        </Nav.Link>
        <Nav.Link
          className="link link text-white"
          style={{
            fontWeight: location.pathname === "/register" ? "700" : "",
          }}
          as={Link}
          to="/register"
        >
          Register
        </Nav.Link>
      </>
    );
  }

  return (
    <>
      <Navbar
        variant="dark"
        style={{
          height: "4.5rem",
          backgroundColor: "#7495FF",
          filter: "drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.14))",
        }}
      >
        <Container>
          <Navbar.Brand className="fw-bold" style={{ fontFamily: "Fira Sans" }}>
            Parking API
          </Navbar.Brand>
          <Nav style={{ fontFamily: "Chivo" }}>{content}</Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
