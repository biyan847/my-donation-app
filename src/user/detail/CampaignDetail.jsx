import React from "react";
import { useParams } from "react-router-dom";
import "./CampaignDetail.css";

const dummyCampaigns = [
  {
    id: 1,
    owner: "Olivia Rhye",
    title: "Ms. Saint-Martin Doranyia Pascal",
    desc: "Hi! This is your Miss Teen Carnival 2022...",
    detail:
      "In 2022 my husband and I moved to Portugal to follow our simple life dream and build our home. We never expected what would come after...",
    eth: 10,
    progress: 50,
    image: "/Background.jpg",
  },
  {
    id: 2,
    owner: "Jaylon Aminoff",
    title: "LET'S MAKE THE DIY...",
    desc: "David Perez aka Chino, who started skating...",
    detail:
      "We are raising funds to create a DIY skate park in our community, built by skaters for skaters.",
    eth: 50,
    progress: 75,
    image: "/donate.jpeg",
  },
  {
    id: 3,
    owner: "Jakob Septimus",
    title: "Mini-Oven for pick-a-pão",
    desc: "I would like nothing more than to continue...",
    detail:
      "This project supports our local bakery to upgrade its oven and continue delivering fresh bread to the community.",
    eth: 19,
    progress: 75,
    image: "/campaign3.jpg",
  },
];

const CampaignDetail = () => {
  const { id } = useParams();
  const campaign = dummyCampaigns.find((c) => c.id === parseInt(id));

  if (!campaign) return <p>Campaign not found.</p>;

  return (
    <div className="campaign-detail-container">
      <div className="campaign-detail-left">
        <h1>{campaign.title}</h1>
        <p className="desc">{campaign.desc}</p>

        <div className="campaign-image-wrapper">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="campaign-image"
          />
        </div>

        <div className="campaign-description">
          <p>
            {campaign.detail} <a href="#">Read more</a>
          </p>
        </div>

        <div className="campaign-organizer">
          <img src="/avatar.jpg" alt="Organizer" className="organizer-avatar" />
          <div>
            <h4>{campaign.owner}</h4>
            <p>Bragança • Organizadora</p>
          </div>
        </div>
      </div>

      <div className="campaign-detail-right">
        <div className="donation-progress">
          <p className="progress-label">🔥 Funds donated to this campaign</p>
          <h3 className="donation-amount">
            ${campaign.eth * 1500} <span>/ $20.000</span>
          </h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${campaign.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="donation-form">
          <p className="form-title">🔥 Fund this campaign</p>
          <input type="number" placeholder="0.50 ETH" className="eth-input" />
          <p className="usd-estimate">~ $950,23</p>
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

export default CampaignDetail;
