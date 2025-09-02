import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../dasbord/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const loadProfile = () => {
      const storedProfile = localStorage.getItem("userProfile");
      let data = null;
      try {
        data = storedProfile ? JSON.parse(storedProfile) : null;
      } catch (err) {
        console.warn("userProfile JSON parse error:", err);
        data = null;
      }
      setProfileData(data || {});
      if (data?.profile_photo) {
        setAvatarUrl(`${data.profile_photo}`);
      } else {
        setAvatarUrl(
          "https://img.icons8.com/?size=100&id=11779&format=png&color=000000"
        );
      }
    };

    loadProfile();
    window.addEventListener("userProfileUpdated", loadProfile);
    return () => {
      window.removeEventListener("userProfileUpdated", loadProfile);
    };
  }, [location]);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  if (isAuthPage) return null;

  const navLinks = [
    { path: "/dashboard", label: "Home" },
    { path: "/explore", label: "Explore" },
  ];
  const isDashboard = location.pathname === "/";

  return (
    <nav className={`navbar ${isDashboard ? "navbar-dark" : "navbar-light"}`}>
      <div className="nav-left">
        <div className="logo" onClick={() => navigate("/dashboard")}>
          Crowdfy
        </div>
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
        <div className="user-info-navbar">
          <div className="user-email-navbar">{profileData?.email}</div>
          <div className="user-name-navbar">{profileData?.full_name}</div>
        </div>
        <img className="avatar" src={avatarUrl} alt="User" />
        <div className="settings-icon" onClick={() => navigate("/settings")}>
          ⚙️
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
