import React, { useState } from "react";
import "./CreateCampaign.css";

const CreateCampaign = () => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [deadline, setDeadline] = useState("");
  const [goal, setGoal] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, story, deadline, goal, image });
    // Handle form submission (e.g. API call)
  };

  return (
    <div className="create-campaign-container">
      <h2>Tell more about your campaign</h2>
      <p>What it’s about your campaign?</p>

      <form onSubmit={handleSubmit} className="campaign-form">
        <label>Your campaign title</label>
        <input
          type="text"
          placeholder="Write here your beautiful title 🌼"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Story</label>
        <textarea
          placeholder="Tell your story here, give details about your scenario. And explain why you need this help on this campaign"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={6}
        ></textarea>

        <label>Create a deadline for your campaign</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <label>Goal</label>
        <input
          type="number"
          placeholder="$10.000"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <label>Upload a beautiful cover image</label>
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
                <span className="upload-text">Clique para enviar</span> ou solte
                sua foto aqui
                <br />
                SVG, PNG, JPG ou GIF (max. 1MB)
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
