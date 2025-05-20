import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../dasbord/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const loadProfile = () => {
      const storedProfile = localStorage.getItem("userProfile");
      let profileData = null;

      try {
        profileData = storedProfile ? JSON.parse(storedProfile) : null;
      } catch (err) {
        console.warn("userProfile JSON parse error:", err);
        profileData = null;
      }

      if (profileData?.profile_photo) {
        setAvatarUrl(
          `http://localhost:5000/uploads/profiles/${profileData.profile_photo}`
        );
      } else {
        setAvatarUrl(null); // fallback jika tidak ada foto
      }
    };

    loadProfile(); // panggil saat pertama render

    // Dengarkan event saat login/update profil
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
    { path: "/campaigns", label: "Campaigns" },
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
        <img
          className="avatar"
          src={
            avatarUrl ||
            "https://img.icons8.com/?size=100&id=11779&format=png&color=000000"
          }
          alt="User"
        />
      </div>
      <div className="settings-icon" onClick={() => navigate("/settings")}>
        ⚙️
      </div>
    </nav>
  );
};

export default Navbar;
