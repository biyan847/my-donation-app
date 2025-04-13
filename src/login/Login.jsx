import React, { useState, useEffect } from "react";
import "./login.css";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    setIsFormValid(email && password && captchaValue);
  }, [email, password, captchaValue]);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleOtpVerify = () => {
    if (otp === "123456") {
      alert("Login berhasil!");
    } else {
      alert("OTP salah, coba lagi.");
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
            {!otpSent ? (
              <>
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
                  By logging in, you agree to our <a href="#">Terms of use</a>{" "}
                  and <a href="#">Privacy Policy</a>
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

export default Login;
