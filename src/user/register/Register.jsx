import React, { useState, useEffect } from "react";
import "./Register.css";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsFormValid(username && email && password && captchaValue);
  }, [username, email, password, captchaValue]);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleOtpVerify = () => {
    if (otp === "123456") {
      alert("Registrasi berhasil!");
      navigate("/login");
    } else {
      alert("OTP salah, coba lagi.");
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
