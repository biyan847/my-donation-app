import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";
import Web3 from "web3";
import DonationEscrow from "../../contracts/DonationEscrow.json";

const CONTRACT_ADDRESS = "0x659736c9e4F2ea03FDEc77d30858963Ea0B819BA";

const Explore = () => {
  const navigate = useNavigate();

  // States untuk filter
  const [searchTerm, setSearchTerm] = useState("");
  const [minEth, setMinEth] = useState("");
  const [maxEth, setMaxEth] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("desc");
  const [dateOrder, setDateOrder] = useState("desc");
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [progressMap, setProgressMap] = useState({});

  // State untuk loading
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/campaigns");
        let data = await res.json();

        data = data.sort((a, b) => b.id - a.id);

        setCampaigns(data);
        setFilteredCampaigns(data);
        fetchAllProgressFromContract(data);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    const fetchAllProgressFromContract = async (campaignsData) => {
      try {
        if (!window.ethereum) return;
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
          DonationEscrow.abi,
          CONTRACT_ADDRESS
        );
        let progressObj = {};
        for (let c of campaignsData) {
          const blockchainId = Number(c.blockchain_campaign_id);
          if (isNaN(blockchainId)) continue;
          try {
            const contractData = await contract.methods
              .getCampaign(blockchainId)
              .call();
            const goal = parseFloat(
              web3.utils.fromWei(contractData.goal, "ether")
            );
            const balance = parseFloat(
              web3.utils.fromWei(contractData.balance, "ether")
            );
            progressObj[c.id] =
              goal > 0 ? Math.min((balance / goal) * 100, 100) : 0;
          } catch {
            progressObj[c.id] = 0;
          }
        }
        setProgressMap(progressObj);
      } catch {
        // ignore jika gagal web3
      }
    };

    fetchCampaigns();
  }, []);

  const handleFilter = () => {
    setIsLoading(true); // Tampilkan loading saat filter aktif
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
    setIsLoading(false); // Sembunyikan loading setelah filter selesai
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

  const resetView = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/campaigns");
      const data = await res.json();
      setFilteredCampaigns(data);
    } catch (err) {
      console.error("Failed to reset view", err);
    } finally {
      setIsLoading(false);
      setSearchTerm("");
      setMinEth("");
      setMaxEth("");
      setStatusFilter("");
      setCategoryFilter("");
      setPriceOrder("desc");
      setDateOrder("desc");
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

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div> {/* Spinner CSS */}
        </div>
      ) : (
        <div className="card-container">
          {filteredCampaigns.map((card) => (
            <div
              className="campaign-card"
              key={card.id}
              onClick={() =>
                navigate(`/campaign/${card.blockchain_campaign_id}`)
              } // << PENTING!
              style={{ cursor: "pointer" }}
            >
              <img src={`${card.image_url}`} alt={card.title} />
              <div className="card-content">
                <p className="owner">{card.owner || "BEM KMFT"}</p>
                <h3>{card.title}</h3>
                <p className="desc">{card.story}</p>
                <div className="bottom-info">
                  <span>🎁 {card.goal_amount} ETH</span>
                  <span>
                    {progressMap[card.id] !== undefined
                      ? progressMap[card.id].toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        // ...
      )}
    </div>
  );
};

export default Explore;
