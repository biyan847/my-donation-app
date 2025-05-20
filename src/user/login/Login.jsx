import React, { useState, useEffect } from "react";
import "./login.css";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsFormValid(email && password && captchaValue);
  }, [email, password, captchaValue]);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login gagal.");

      // ✅ Simpan token
      localStorage.setItem("userToken", data.token);

      // ✅ Ambil data profil
      const profileRes = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      if (!profileRes.ok) throw new Error("Gagal mengambil data profil.");

      const profileData = await profileRes.json();
      localStorage.setItem("userProfile", JSON.stringify(profileData.user));

      // ✅ Trigger avatar refresh di Navbar
      window.dispatchEvent(new Event("userProfileUpdated"));

      alert("Login berhasil!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Terjadi kesalahan saat login.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left" />
      <div className="login-right">
        <div className="back-arrow" onClick={() => window.history.back()}>
          ← Back
        </div>

        <motion.div
          className="login-box"
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <h2>Log In</h2>

          <form onSubmit={handleLogin}>
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <span
                className="hide-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️‍🔨" : "👁"}
              </span>
            </div>

            <small>
              Use 8 or more characters with a mix of letters, numbers & symbols
            </small>

            <p className="terms">
              By logging in, you agree to our <a href="#">Terms of use</a> and{" "}
              <a href="#">Privacy Policy</a>
            </p>

            <div className="captcha-wrapper">
              <ReCAPTCHA
                sitekey="6LdXrAArAAAAAHHE0NB56Bt809S651ojORkceXmD"
                onChange={handleCaptchaChange}
              />
            </div>

            <button
              type="submit"
              className={`create-account-btn ${isFormValid ? "active" : ""}`}
              disabled={!isFormValid}
            >
              Log In
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
