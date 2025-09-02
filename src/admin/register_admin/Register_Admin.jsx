import React, { useState, useEffect } from "react";
import "./Register_Admin.css";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Register_Admin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFormValid(username && email && password && captchaValue);
  }, [username, email, password, captchaValue]);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleProfilePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePhoto) {
        formData.append("profile_photo", profilePhoto);
      }

      const response = await fetch(
        "http://localhost:5000/api/admins/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registrasi admin berhasil! Silakan login.");
        navigate("/admin-login");
      } else {
        alert(data.message || "Registrasi gagal.");
      }
    } catch (err) {
      alert("Terjadi kesalahan server.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-left" />
      <div className="admin-register-right">
        <div className="admin-back-arrow" onClick={() => navigate(-1)}>
          ← Back
        </div>

        <motion.div
          className="admin-register-box"
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <h2>Admin Registration</h2>
          <form onSubmit={handleRegister} encType="multipart/form-data">
            <label>User name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

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
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>

            <small>
              Use 8 or more characters with a mix of letters, numbers & symbols
            </small>

            <label>Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
            />
            {profilePhoto && (
              <img
                src={URL.createObjectURL(profilePhoto)}
                alt="Preview"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 8,
                  marginTop: 8,
                }}
              />
            )}

            <p className="admin-terms">
              By creating an admin account, you agree to our{" "}
              <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>
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
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            <p
              className="admin-login-link"
              onClick={() => navigate("/admin-login")}
            >
              Sudah punya akun? <span>Log in</span>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register_Admin;
