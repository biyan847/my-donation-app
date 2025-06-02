import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar_Admin.css";

const Navbar_Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  if (isAuthPage) return null;

  const navLinks = [
    { path: "/dashboardadmin", label: "Home" },
    { path: "/exploreadmin", label: "Explore" },
    { path: "/userlistadmin", label: "User List" },
    { path: "/createcampaignadmin", label: "Create Campaign" },
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

      {/* Placeholder kosong untuk menjaga layout tetap seimbang */}
      <div style={{ width: "50px" }}></div>
    </nav>
  );
};

export default Navbar_Admin;
