import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  console.log("User in Dashboard", user);

  return <div>dashboard</div>;
};

export default Dashboard;
