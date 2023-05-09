// react imports
import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// library imports
import { Navbar, Nav, Container } from "react-bootstrap";
import { Bars3Icon } from "@heroicons/react/24/outline";

// store imports
import { LOGOUT } from "../store/user/userSlice";
import { REMOVE_DATA } from "../store/camera/cameraSlice";

const Navigation = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [redirect, setRedirect] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
          className="link text-white"
          style={{
            fontWeight: location.pathname === "/" ? "700" : "",
          }}
          as={Link}
          to="/"
        >
          Home
        </Nav.Link>
        <Nav.Link
          className="link text-white"
          style={{
            fontWeight: location.pathname === "/profile" ? "700" : "",
          }}
          as={Link}
          to="/profile"
        >
          Profile
        </Nav.Link>
        <Nav.Link as={Link} onClick={logoutHandler} className="link text-white">
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
    <Navbar expand="lg" variant="dark" style={{ backgroundColor: "#7495FF" }}>
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold"
          style={{ fontFamily: "Fira Sans" }}
        >
          Parking API
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(!expanded)}
        >
          <Bars3Icon
            className="text-white"
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
        </Navbar.Toggle>
        <Navbar.Collapse
          id="navbar-nav"
          className={`justify-content-end ${expanded ? "show" : ""}`}
        >
          <Nav className="text-center" style={{ fontFamily: "Chivo" }}>
            {content}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
