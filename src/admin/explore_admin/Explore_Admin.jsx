import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore_Admin.css";
import { FaCheckCircle, FaBan, FaTrashAlt } from "react-icons/fa";

const AdminExplore = () => {
  const navigate = useNavigate();
  const [adminCampaigns, setAdminCampaigns] = useState([]);
  const [adminFilteredCampaigns, setAdminFilteredCampaigns] = useState([]);
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [adminMinEth, setAdminMinEth] = useState("");
  const [adminMaxEth, setAdminMaxEth] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState("");
  const [adminCategoryFilter, setAdminCategoryFilter] = useState("");
  const [adminPriceOrder, setAdminPriceOrder] = useState("desc");
  const [adminDateOrder, setAdminDateOrder] = useState("desc");
  const [adminShowFilters, setAdminShowFilters] = useState(false);

  useEffect(() => {
    const fetchAdminCampaigns = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const res = await fetch("http://localhost:5000/api/admins/campaigns", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAdminCampaigns(data);
        setAdminFilteredCampaigns(data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };

    fetchAdminCampaigns();
  }, []);

  const handleAdminFilter = () => {
    let result = [...adminCampaigns];
    if (adminSearchTerm) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
          c.story.toLowerCase().includes(adminSearchTerm.toLowerCase())
      );
    }
    if (adminMinEth) {
      result = result.filter((c) => c.goal_amount >= parseFloat(adminMinEth));
    }
    if (adminMaxEth) {
      result = result.filter((c) => c.goal_amount <= parseFloat(adminMaxEth));
    }
    if (adminStatusFilter) {
      result = result.filter((c) => c.status === adminStatusFilter);
    }
    if (adminCategoryFilter) {
      result = result.filter((c) => c.category === adminCategoryFilter);
    }
    setAdminFilteredCampaigns(result);
  };

  const toggleAdminSortByPrice = () => {
    const nextOrder = adminPriceOrder === "asc" ? "desc" : "asc";
    const sorted = [...adminFilteredCampaigns].sort((a, b) =>
      nextOrder === "asc"
        ? a.goal_amount - b.goal_amount
        : b.goal_amount - a.goal_amount
    );
    setAdminFilteredCampaigns(sorted);
    setAdminPriceOrder(nextOrder);
  };

  const toggleAdminSortByDate = () => {
    const nextOrder = adminDateOrder === "asc" ? "desc" : "asc";
    const sorted = [...adminFilteredCampaigns].sort((a, b) =>
      nextOrder === "asc"
        ? new Date(a.deadline) - new Date(b.deadline)
        : new Date(b.deadline) - new Date(a.deadline)
    );
    setAdminFilteredCampaigns(sorted);
    setAdminDateOrder(nextOrder);
  };

  const resetAdminView = () => {
    setAdminFilteredCampaigns(adminCampaigns);
    setAdminSearchTerm("");
    setAdminMinEth("");
    setAdminMaxEth("");
    setAdminStatusFilter("");
    setAdminCategoryFilter("");
    setAdminPriceOrder("desc");
    setAdminDateOrder("desc");
  };

  const handleAdminVerify = async (e, id) => {
    e.stopPropagation();
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `http://localhost:5000/api/admins/campaigns/${id}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "active" }),
        }
      );
      if (res.ok) {
        alert("Campaign verified!");
        setAdminFilteredCampaigns((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "active" } : c))
        );
      }
    } catch (err) {
      console.error("Error verifying campaign:", err);
    }
  };

  const handleAdminDeactivate = async (e, id) => {
    e.stopPropagation();
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `http://localhost:5000/api/admins/campaigns/${id}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "inactive" }),
        }
      );
      if (res.ok) {
        alert("Campaign deactivated.");
        setAdminFilteredCampaigns((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "inactive" } : c))
        );
      }
    } catch (err) {
      console.error("Error deactivating campaign:", err);
    }
  };

  const handleAdminDelete = async (e, id) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `http://localhost:5000/api/admins/campaigns/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        alert("Campaign deleted.");
        setAdminFilteredCampaigns((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Error deleting campaign:", err);
    }
  };

  return (
    <div className="explore-container">
      <div className="explore-header">
        <div className="explore-heading-group">
          <h1>Explore</h1>
          <p>Where do you want to help</p>
        </div>
        <div className="filter-buttons">
          <button onClick={resetAdminView}>All views</button>
          <button onClick={toggleAdminSortByPrice}>
            {adminPriceOrder === "asc" ? "↓ Price (low)" : "↑ Price (high)"}
          </button>
          <button onClick={toggleAdminSortByDate}>
            {adminDateOrder === "asc" ? "↓ Date (old)" : "↑ Date (new)"}
          </button>
          <button onClick={() => setAdminShowFilters(!adminShowFilters)}>
            {adminShowFilters ? "Hide filters" : "Show filters"}
          </button>
        </div>
      </div>

      {adminShowFilters && (
        <div className="filter-card">
          <input
            type="text"
            placeholder="Search title or description"
            value={adminSearchTerm}
            onChange={(e) => setAdminSearchTerm(e.target.value)}
          />
          <div className="price-range">
            <input
              type="number"
              placeholder="Min ETH"
              value={adminMinEth}
              onChange={(e) => setAdminMinEth(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max ETH"
              value={adminMaxEth}
              onChange={(e) => setAdminMaxEth(e.target.value)}
            />
          </div>
          <select
            value={adminStatusFilter}
            onChange={(e) => setAdminStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={adminCategoryFilter}
            onChange={(e) => setAdminCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Sports">Sports</option>
          </select>
          <button className="execute-filter-btn" onClick={handleAdminFilter}>
            Apply Filters
          </button>
        </div>
      )}

      <div className="card-container">
        {adminFilteredCampaigns.map((card) => (
          <div
            className="campaign-card"
            key={card.id}
            onClick={() => navigate(`/admin/campaign/${card.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={`http://localhost:5000/uploads/campaigns/${card.image_url}`}
              alt={card.title}
            />
            <div className="card-content">
              <div className="admin-actions-top">
                <div className="left-icons">
                  <FaCheckCircle
                    className={`icon-button1 ${
                      card.status === "active" ? "icon-active" : "icon-inactive"
                    }`}
                    title="Verify"
                    onClick={(e) => handleAdminVerify(e, card.id)}
                  />
                  <FaBan
                    className={`icon-button2 ${
                      card.status === "inactive"
                        ? "icon-inactive-ban"
                        : "icon-inactive"
                    }`}
                    title="Deactivate"
                    onClick={(e) => handleAdminDeactivate(e, card.id)}
                  />
                </div>
                <FaTrashAlt
                  className="icon-button right3"
                  title="Delete"
                  onClick={(e) => handleAdminDelete(e, card.id)}
                />
              </div>
              <p className="owner">{card.owner_name}</p>
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
    </div>
  );
};

export default AdminExplore;
