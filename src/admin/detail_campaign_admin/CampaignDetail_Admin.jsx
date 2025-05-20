import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CampaignDetail_Admin.css"; // tetap pakai styling yang sama

const CampaignDetail_Admin = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `http://localhost:5000/api/admins/campaigns/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setCampaign(data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch campaign detail", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignDetail();
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (!campaign) return <p>Campaign not found.</p>;

  return (
    <div className="campaign-detail-container">
      <div className="campaign-detail-left">
        <h1>{campaign.title}</h1>
        <p className="desc">{campaign.story}</p>

        <div className="campaign-image-wrapper">
          <img
            src={`http://localhost:5000/uploads/campaigns/${campaign.image_url}`}
            alt={campaign.title}
            className="campaign-image"
          />
        </div>

        <div className="campaign-description">
          <p>{campaign.story}</p>
        </div>

        <div className="campaign-organizer">
          <img
            src={`http://localhost:5000/uploads/profiles/${campaign.profile_photo}`}
            alt="Organizer"
            className="organizer-avatar"
          />
          <div>
            <h4>{campaign.owner_name}</h4>
            <p>Campaign Organizer</p>
          </div>
        </div>
      </div>

      <div className="campaign-detail-right">
        <div className="donation-progress">
          <p className="progress-label">🔥 Funds donated to this campaign</p>
          <h3 className="donation-amount">
            {campaign.goal_amount} ETH <span>/ Target</span>
          </h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${campaign.progress || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="donation-form">
          <p className="form-title">🔥 Fund this campaign</p>
          <input type="number" placeholder="0.50 ETH" className="eth-input" />
          <p className="usd-estimate">~ $950.00</p>
          <textarea
            placeholder="Words of support 💌"
            className="support-textarea"
          ></textarea>
          <button className="donate-button">💚 Donate now</button>
          <p className="note">
            Not only numbers make the difference on our lives :)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail_Admin;
