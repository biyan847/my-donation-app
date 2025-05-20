import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Campaign.css";

const Campaign = () => {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([campaigns]);
  const [priceOrder, setPriceOrder] = useState("desc");
  const [dateOrder, setDateOrder] = useState("desc");

  // Tambahan: state loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch("http://localhost:5000/api/campaigns", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCampaigns(data);
        setFilteredCampaigns(data);
      } catch (err) {
        console.error("Failed to fetch user campaigns", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCampaigns();
  }, []);

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

  const resetView = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/campaigns", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFilteredCampaigns(data);
    } catch (err) {
      console.error("Failed to reset view", err);
    } finally {
      setIsLoading(false);
      setPriceOrder("desc");
      setDateOrder("desc");
    }
  };

  return (
    <div className="campaign-container">
      <div className="campaign-header">
        <div className="campaign-heading-group">
          <h1>My Campaign</h1>
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

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="card-container">
          {filteredCampaigns.map((card) => (
            <div
              className="campaign-card"
              key={card.id}
              onClick={() => navigate(`/campaign/${card.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`http://localhost:5000/uploads/campaigns/${card.image_url}`}
                alt={card.title}
              />
              <div className="card-content">
                <p className="owner">{card.status}</p>
                <h3>{card.title}</h3>
                <p className="desc">{card.story}</p>
                <div className="bottom-info">
                  <span>🎁 {card.goal_amount} ETH</span>
                  <span>{card.progress || 0}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaign;
