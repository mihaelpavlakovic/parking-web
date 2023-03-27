// react imports
import React from "react";
import { useSelector } from "react-redux";

// component imports
import Navigation from "../components/Navigation";

const Dashboard = () => {
  const user = useSelector(state => state.user.user);
  return (
    <div>
      <Navigation />
      <h1>Dashboard</h1>
      <p>{user}</p>
    </div>
  );
};

export default Dashboard;
