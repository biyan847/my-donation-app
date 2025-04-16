import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Campaign.css";

const Campaign = () => {
  const campaigns = [
    {
      id: 1,
      owner: "Olivia Rhye",
      title: "Ms. Saint-Martin Doranyia Pascal",
      desc: "Hi! This is your Miss Teen Carnival 2022...",
      eth: 10,
      progress: 50,
      image: "/Background.jpg",
      date: "2024-04-01",
      status: "active",
      category: "Education",
    },
    {
      id: 2,
      owner: "Jaylon Aminoff",
      title: "LET'S MAKE THE DIY...",
      desc: "David Perez aka Chino, who started skating...",
      eth: 50,
      progress: 75,
      image: "/donate.jpeg",
      date: "2024-03-15",
      status: "completed",
      category: "Sports",
    },
    {
      id: 3,
      owner: "Jakob Septimus",
      title: "Mini-Oven for pick-a-pão",
      desc: "I would like nothing more than to continue...",
      eth: 19,
      progress: 75,
      image: "/campaign3.jpg",
      date: "2024-03-25",
      status: "active",
      category: "Health",
    },
  ];

  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);
  const [priceOrder, setPriceOrder] = useState("desc");
  const [dateOrder, setDateOrder] = useState("desc");

  const toggleSortByPrice = () => {
    const nextOrder = priceOrder === "asc" ? "desc" : "asc";
    const sorted = [...filteredCampaigns].sort((a, b) =>
      nextOrder === "asc" ? a.eth - b.eth : b.eth - a.eth
    );
    setFilteredCampaigns(sorted);
    setPriceOrder(nextOrder);
  };

  const toggleSortByDate = () => {
    const nextOrder = dateOrder === "asc" ? "desc" : "asc";
    const sorted = [...filteredCampaigns].sort((a, b) =>
      nextOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );
    setFilteredCampaigns(sorted);
    setDateOrder(nextOrder);
  };
  const resetView = () => {
    setFilteredCampaigns(campaigns);
    setPriceOrder("desc");
    setDateOrder("desc");
  };

  return (
    <div className="campaign-container">
      <div className="campaign-header">
        <div className="campaign-heading-group">
          <h1>MY CAMPAIGNS</h1>
          <p>Where do you want to help</p>
        </div>

        <div className="filter-buttons">
          <button onClick={resetView}>All views</button>
          <button onClick={toggleSortByPrice}>
            {priceOrder === "asc" ? "↓ Price (low)" : "↑ Price (high)"}
          </button>
          <button onClick={toggleSortByDate}>
            {dateOrder === "asc" ? "↓ Date (old)" : "↑ Date (new)"}
          </button>

          <Link to="/create-campaign" className="campaign-execute-filter-btn">
            + New Campaign
          </Link>
        </div>
      </div>

      <div className="card-container">
        {filteredCampaigns.map((card) => (
          <div className="campaign-card" key={card.id}>
            <img src={card.image} alt={card.title} />
            <div className="card-content">
              <p className="owner">{card.owner}</p>
              <h3>{card.title}</h3>
              <p className="desc">{card.desc}</p>
              <div className="bottom-info">
                <span>🎁 {card.eth} eth</span>
                <span>{card.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaign;
