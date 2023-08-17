// library imports
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";

// react imports
import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// store imports
import { removeStateCameraData } from "../store/camera/cameraSlice";
import { logout } from "../store/user/userActions";
import { selectUser } from "../store/user/userSlice";

function OffcanvasExample() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const logoutHandler = () => {
    dispatch(removeStateCameraData());
    dispatch(logout());
    setRedirect(true);
  };

  useEffect(() => {
    const handleTokenChange = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(removeStateCameraData());
        dispatch(logout());
        setRedirect(true);
      }
    };

    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleTokenChange);
    };
  }, [dispatch]);

  if (redirect) {
    return <Navigate to="/login" />;
  }

  let content;
  if (token && !redirect) {
    content = (
      <>
        <Nav.Link
          as={Link}
          to="/"
          className="link"
          style={{
            fontWeight: location.pathname === "/" ? "700" : "",
          }}
        >
          Home
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/cameras"
          className="link"
          style={{
            fontWeight: location.pathname.startsWith("/cameras/") ? "700" : "",
          }}
        >
          Cameras
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/profile"
          className="link"
          style={{
            fontWeight: location.pathname === "/profile" ? "700" : "",
          }}
        >
          Profile
        </Nav.Link>
        <Nav.Link as={Link} className="link" onClick={logoutHandler}>
          Logout
        </Nav.Link>
      </>
    );
  } else {
    content = (
      <>
        <Nav.Link
          as={Link}
          to="/login"
          className="link"
          style={{
            fontWeight: location.pathname === "/login" ? "700" : "",
          }}
        >
          Login
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/register"
          className="link"
          style={{
            fontWeight: location.pathname === "/register" ? "700" : "",
          }}
        >
          Register
        </Nav.Link>
      </>
    );
  }

  return (
    <Navbar expand="md" className="bg-body-tertiary mb-3" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/" className="fw-bold">
          ParkingAPI
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          aria-labelledby={`offcanvasNavbarLabel-expand-md`}
          placement="end"
          data-bs-theme="dark"
          className="w-75"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id={`offcanvasNavbarLabel-expand-md`}
              className="fw-bold"
            >
              {user?.email.split("@")[0]}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3 gap-2 text-end d-md-none display-6">
              {content}
            </Nav>
            <Nav className="justify-content-end flex-grow-1 pe-3 gap-2 text-end d-none d-md-flex">
              {content}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default OffcanvasExample;
