import React, { useState } from "react";
import "./Settings.css";
import cityList from "../data/cities.json";

const Settings = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewBanner(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log({ firstName, lastName, email, location, avatar, banner });
  };

  return (
    <div className="settings-container">
      <div className="settings-header"></div>
      <div>
        <h2>Personal Info</h2>
        <p>Update your personal info with your data preferences</p>
      </div>

      <div className="settings-content">
        {/* Left: Form */}
        <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group name-fields">
            <div className="input-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                placeholder="First"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>&nbsp;</label>
              <input
                type="text"
                placeholder="Last"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Foto Profile</label>
            <div className="profile-upload">
              {previewAvatar ? (
                <img
                  src={previewAvatar}
                  alt="avatar"
                  className="avatar-preview"
                />
              ) : (
                <div className="avatar-placeholder">👤</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Localization</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select your city</option>
              {cityList.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Banner Image</label>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {previewBanner && (
                <img
                  src={previewBanner}
                  alt="banner"
                  className="banner-preview"
                />
              )}
              <div className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                />
                <p>
                  <span className="upload-text">Click here to upload</span> ou
                  drag here your image
                  <br />
                  <small>Recommended 800×600 resolution (max. 1MB)</small>
                </p>
              </div>
            </div>
          </div>

          <button type="submit" className="save-button" onClick={handleSave}>
            Save settings
          </button>
        </form>

        {/* Right: Preview card */}
        <div className="profile-card-preview">
          <div className="card-banner">
            {previewBanner ? (
              <img src={previewBanner} alt="banner" />
            ) : (
              <div className="card-banner-placeholder"></div>
            )}
          </div>
          <div className="card-info">
            {previewAvatar && (
              <img src={previewAvatar} alt="avatar" className="card-avatar" />
            )}
            <div className="card-meta">
              <strong>
                {firstName} {lastName}
              </strong>
              <span> {location}</span>
            </div>
          </div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: "90%" }}></div>
          </div>
          <div className="xp-text">
            <span>18.543 XP/20.000 XP</span>
            <span>Level 8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
