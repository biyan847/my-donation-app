import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";

const Explore = () => {
  const navigate = useNavigate();
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

  const [searchTerm, setSearchTerm] = useState("");
  const [minEth, setMinEth] = useState("");
  const [maxEth, setMaxEth] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("desc");
  const [dateOrder, setDateOrder] = useState("desc");
  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilter = () => {
    let result = [...campaigns];

    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minEth) {
      result = result.filter((c) => c.eth >= parseFloat(minEth));
    }

    if (maxEth) {
      result = result.filter((c) => c.eth <= parseFloat(maxEth));
    }

    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (categoryFilter) {
      result = result.filter((c) => c.category === categoryFilter);
    }

    setFilteredCampaigns(result);
  };

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
    setSearchTerm("");
    setMinEth("");
    setMaxEth("");
    setStatusFilter("");
    setCategoryFilter("");
    setPriceOrder("desc");
    setDateOrder("desc");
  };

  return (
    <div className="explore-container">
      <div className="explore-header">
        <div className="explore-heading-group">
          <h1>Explore</h1>
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
          <button onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter-card">
          <input
            type="text"
            placeholder="Search title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="price-range">
            <input
              type="number"
              placeholder="Min ETH"
              value={minEth}
              onChange={(e) => setMinEth(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max ETH"
              value={maxEth}
              onChange={(e) => setMaxEth(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Sports">Sports</option>
          </select>

          <button className="execute-filter-btn" onClick={handleFilter}>
            Apply Filters
          </button>
        </div>
      )}

      <div className="card-container">
        {filteredCampaigns.map((card) => (
          <div
            className="campaign-card"
            key={card.id}
            onClick={() => navigate(`/campaign/${card.id}`)}
            style={{ cursor: "pointer" }}
          >
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

export default Explore;
