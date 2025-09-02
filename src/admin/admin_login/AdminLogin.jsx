import React, { useState } from "react";
import "./AdminLoginLogin.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/admins/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token); // ✅ bukan "token"
        localStorage.setItem("admin", "true");
        alert("Login admin berhasil!");
        console.log("Login berhasil, akan redirect...");
        navigate("/dashboardadmin");
      } else {
        alert(data.message || "Login gagal.");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat login.");
      console.error(err);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-left" />
      <div className="admin-login-right">
        <div className="admin-back-arrow" onClick={() => window.history.back()}>
          ← Back
        </div>

        <motion.div
          className="admin-login-box"
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <h2>Admin Login</h2>

          <form onSubmit={handleLogin}>
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <div className="admin-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <span
                className="admin-hide-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️‍🔨" : "👁"}
              </span>
            </div>

            <button type="submit" className="admin-login-btn">
              Log In
            </button>
            <p
              className="admin-register-link"
              onClick={() => navigate("/register-admin")}
            >
              Belum punya akun? <span>Register</span>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
