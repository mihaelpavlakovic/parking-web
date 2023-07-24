// react imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT, selectUser } from "../store/user/userSlice";

// component imports
import Navigation from "../components/Navigation";
import { Button, Container } from "react-bootstrap";
import { deleteUser } from "../store/user/userActions";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteUserHandler = () => {
    const confirmAction = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmAction) {
      dispatch(deleteUser()).then(() => {
        dispatch(LOGOUT());
        navigate("/login");
      });
    }
  };

  return (
    <div>
      <Navigation />
      <Container className="mt-4">
        <h1>Profile Page</h1>
        <p>Logged in as: {user?.email}</p>

        <h2 className="mt-5">Account Control</h2>
        <hr />
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5">
          <span>
            Once you delete your account, there is no going back. Please be
            certain.
          </span>
          <Button
            variant="danger"
            onClick={deleteUserHandler}
            className="mt-3 mt-md-0"
          >
            Delete User
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
