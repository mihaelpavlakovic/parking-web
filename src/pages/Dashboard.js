// react imports
import React from "react";
import { useSelector } from "react-redux";

// bootstrap imports
import { Container } from "react-bootstrap";
import Image from "react-bootstrap/Image";

// component imports
import Navigation from "../components/Navigation";

const Dashboard = () => {
  const user = useSelector(state => state.user.user?.email);

  let content;
  const getStatus = useSelector(state => state.user.getUserStatus);
  if (getStatus === "loading") {
    content = "Loading...";
  } else if (getStatus === "succeeded") {
    content = (
      <>
        <div>
          <h1 className="mt-4">Dashboard</h1>
          {user !== null && <p>Logged in as {user}</p>}
        </div>
        <Image
          src="https://images.drive.com.au/driveau/image/upload/c_fill,f_auto,g_auto,h_675,q_auto:eco,w_1200/cms/uploads/kqumpstza2v83tvd20cj"
          alt="Parking lot feed"
          className="w-100"
        />
      </>
    );
  } else if (getStatus === "failed") {
    content = "Error";
  }

  return (
    <div>
      <Navigation />
      <Container className="w-full d-flex flex-column gap-4">
        {content}
      </Container>
    </div>
  );
};

export default Dashboard;
