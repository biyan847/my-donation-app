import React from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // pastikan path sesuai struktur folder

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>Solve problems all around the world</h1>
          <p>
            Find and sign campaigns and missions in all the 234 countries on the
            globe
          </p>
          <button className="get-started" onClick={() => navigate("/register")}>
            Get Started
          </button>
          <p className="login-text">
            Already have an account?{" "}
            <span className="login-linkdb" onClick={() => navigate("/login")}>
              Log in
            </span>
          </p>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
