import React, { useState, useEffect } from "react";
import "./Register.css";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsFormValid(username && nim && email && password && captchaValue);
  }, [username, nim, email, password, captchaValue]);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Kirim data lengkap register
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, nim, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Kirim OTP setelah registrasi berhasil
        const otpResponse = await fetch("http://localhost:5000/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (otpResponse.ok) {
          alert("Registrasi berhasil! Silakan cek email untuk OTP.");
          setOtpSent(true);
        } else {
          const otpData = await otpResponse.json();
          alert(otpData.message || "Gagal mengirim OTP.");
        }
      } else {
        alert(data.message || "Registrasi gagal.");
      }
    } catch (err) {
      alert("Terjadi kesalahan server.");
      console.error(err);
    }
  };

  const handleOtpVerify = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("OTP valid. Registrasi selesai!");
        navigate("/login");
      } else {
        alert(data.message || "OTP salah atau kedaluwarsa.");
      }
    } catch (err) {
      alert("Gagal verifikasi OTP.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left" />
      <div className="register-right">
        <div className="back-arrow" onClick={() => navigate(-1)}>
          ← Back
        </div>

        <motion.div
          className="register-box"
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <h2>Create an account</h2>
          <form onSubmit={handleRegister}>
            {!otpSent ? (
              <>
                <label>User name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <label>NIM</label>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                />

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
                    {showPassword ? "👁️‍🗨️" : "👁️"}
                  </span>
                </div>

                <small>
                  Use 8 or more characters with a mix of letters, numbers &
                  symbols
                </small>

                <p className="terms">
                  By creating an account, you agree to our{" "}
                  <a href="#">Terms of use</a> and{" "}
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
                  className={`create-account-btn ${
                    isFormValid ? "active" : ""
                  }`}
                  disabled={!isFormValid}
                >
                  Send OTP
                </button>

                <p className="terms">
                  Already have an account? <a href="/login">Log in</a>
                </p>
              </>
            ) : (
              <motion.div
                initial={{ x: "100vw", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              >
                <label>Enter OTP sent to your email</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                />
                <button
                  type="button"
                  onClick={handleOtpVerify}
                  className="create-account-btn active"
                >
                  Verify OTP
                </button>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
