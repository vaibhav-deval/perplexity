import React from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { useEffect } from "react";

const Dashboard = () => {
  const chat = useChat();
  const user = useSelector((state) => state.auth.user);
  console.log("User in Dashboard", user);
  useEffect(() => {
    chat.initializeSocketConnection();
  },[]);

  return <div>dashboard</div>;
};

export default Dashboard;
