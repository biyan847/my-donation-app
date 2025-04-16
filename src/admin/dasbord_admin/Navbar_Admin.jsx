import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar_Admin.css";

const Navbar_Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  if (isAuthPage) return null;

  const navLinks = [
    { path: "/dasboardadmin", label: "Home" },
    { path: "/exploreadmin", label: "Explore" },
  ];

  const isDashboard = location.pathname === "/";

  return (
    <nav className={`navbar ${isDashboard ? "navbar-dark" : "navbar-light"}`}>
      <div className="nav-left">
        <div className="logo">Crowdfy</div>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <a
                onClick={() => navigate(link.path)}
                className={location.pathname === link.path ? "active-link" : ""}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-right">
        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>
        <img
          className="avatar"
          src="https://img.icons8.com/?size=100&id=11779&format=png&color=000000"
          alt="User"
        />
        <div className="settings-icon" onClick={() => navigate("/settings")}>
          ⚙️
        </div>
      </div>
    </nav>
  );
};

export default Navbar_Admin;
