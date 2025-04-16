import React from "react";
import "./Dashboard_Admin.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar_Admin"; // pastikan path sesuai struktur folder
import { useEffect } from "react";

const Dashboard_Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login"); // Jika tidak ada token, arahkan ke halaman login
    }
  }, [navigate]);

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
          <button className="get-started" onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>
      </section>
    </>
  );
};

export default Dashboard_Admin;
