import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateCampaign.css";

const CreateCampaign = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [deadline, setDeadline] = useState("");
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !story || !deadline || !goal || !category) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("story", story);
    formData.append("deadline", deadline);
    formData.append("goal_amount", goal);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Campaign created successfully!");
        navigate("/campaigns");
      } else {
        alert(`Failed to create campaign: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="create-campaign-container">
      <h2>Tell more about your campaign</h2>
      <p>What it’s about your campaign?</p>

      <form onSubmit={handleSubmit} className="campaign-form">
        <label>Your campaign title *</label>
        <input
          type="text"
          placeholder="Write here your beautiful title 🌼"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Story *</label>
        <textarea
          placeholder="Tell your story here, give details about your scenario. And explain why you need this help on this campaign"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={6}
          required
        ></textarea>

        <label>Create a deadline for your campaign *</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        <label>Goal (amount in ETH) *</label>
        <input
          type="number"
          placeholder="e.g. 10"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />

        <label>Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select category</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Sports">Sports</option>
        </select>

        <label>Upload a beautiful cover image (optional)</label>
        <div className="image-upload">
          {preview ? (
            <img src={preview} alt="Preview" className="preview-image" />
          ) : (
            <div className="upload-placeholder">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p>
                <span className="upload-text">Click to upload</span> or drag
                your photo here
                <br />
                SVG, PNG, JPG, or GIF (max. 1MB)
              </p>
            </div>
          )}
        </div>

        <button type="submit" className="create-button">
          ➕ CREATE
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
