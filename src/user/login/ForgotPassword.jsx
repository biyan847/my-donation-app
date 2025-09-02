import React, { useState } from "react";
import "./ForgotPassword.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1=Email, 2=OTP, 3=Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  // validasi untuk tombol aktif
  React.useEffect(() => {
    if (step === 1) setIsFormValid(email && captchaValue);
    else if (step === 2) setIsFormValid(email && otp);
    else if (step === 3) setIsFormValid(newPassword.length >= 8);
  }, [email, otp, newPassword, captchaValue, step]);

  const handleCaptchaChange = (value) => setCaptchaValue(value);

  // Step 1: Kirim OTP ke email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP sudah dikirim ke email kamu.");
        setStep(2);
      } else {
        alert(data.message || "Gagal mengirim OTP.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server.");
      console.error(err);
    }
  };

  // Step 2: Verifikasi OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/reset-verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("OTP valid, silakan buat password baru.");
        setStep(3);
      } else {
        alert(data.message || "OTP salah.");
      }
    } catch (err) {
      alert("Gagal verifikasi OTP.");
      console.error(err);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Password berhasil direset! Silakan login.");
        navigate("/login");
      } else {
        alert(data.message || "Gagal reset password.");
      }
    } catch (err) {
      alert("Gagal reset password.");
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
          <h2>Reset Password</h2>
          <form
            onSubmit={
              step === 1
                ? handleSendOtp
                : step === 2
                ? handleVerifyOtp
                : handleResetPassword
            }
          >
            {step === 1 && (
              <>
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                  Kirim OTP ke Email
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <label>Kode OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Masukkan OTP"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className={`create-account-btn ${
                    isFormValid ? "active" : ""
                  }`}
                  disabled={!isFormValid}
                >
                  Verifikasi OTP
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <label>Password Baru</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span
                    className="hide-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️‍🗨️" : "👁️"}
                  </span>
                </div>
                <small>
                  Gunakan minimal 8 karakter, gabungan huruf & angka.
                </small>
                <button
                  type="submit"
                  className={`create-account-btn ${
                    isFormValid ? "active" : ""
                  }`}
                  disabled={!isFormValid}
                >
                  Reset Password
                </button>
              </>
            )}

            <p className="terms" style={{ marginTop: 20 }}>
              Kembali ke <a href="/login">Login</a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
