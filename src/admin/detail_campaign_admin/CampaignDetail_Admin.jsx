import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import DonationEscrow from "../../contracts/DonationEscrow.json";
import "./CampaignDetail_Admin.css";

const CONTRACT_ADDRESS = "0x659736c9e4F2ea03FDEc77d30858963Ea0B819BA";

const CampaignDetail_Admin = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tambahkan state untuk menyimpan data dari IPFS
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  // Ini untuk progress bar
  const [contractGoal, setContractGoal] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Ambil data dari backend (info campaign, gambar, dll)
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
        console.log(data);
        if (res.ok) {
          // Ambil ipfs_cid dan fetch data dari IPFS
          const ipfsData = await fetchFromIPFS(data.ipfs_cid);
          if (ipfsData) {
            // Simpan data dari IPFS ke state
            setTitle(ipfsData.title);
            setDescription(ipfsData.description);
            setDeadline(ipfsData.deadline);
          }
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

  // Ambil data campaign di smart contract
  useEffect(() => {
    const fetchProgressFromContract = async () => {
      try {
        if (!campaign) return;
        // Pastikan blockchain_campaign_id sudah benar
        const blockchainCampaignId =
          campaign.blockchain_campaign_id || campaign.id;

        console.log(
          "Ini adalah id Campaign di blockchain",
          typeof blockchainCampaignId
        );

        if (!window.ethereum) return;

        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
          DonationEscrow.abi,
          CONTRACT_ADDRESS
        );
        const contractCampaign = await contract.methods
          .getCampaign(blockchainCampaignId)
          .call();

        const goal = parseFloat(
          web3.utils.fromWei(contractCampaign.goal, "ether")
        );
        const balance = parseFloat(
          web3.utils.fromWei(contractCampaign.balance, "ether")
        );
        setContractGoal(goal);
        setContractBalance(balance);

        // Animasi progress (hitung persen)
        const progress = goal > 0 ? Math.min((balance / goal) * 100, 100) : 0;
        setTimeout(() => setAnimatedProgress(progress), 300);
      } catch (err) {
        console.error("Failed to fetch blockchain campaign", err);
      }
    };

    fetchProgressFromContract();
  }, [campaign]);

  // Fungsi Withdraw dari smart contract
  const handleWithdraw = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        DonationEscrow.abi,
        CONTRACT_ADDRESS
      );
      const blockchainCampaignId =
        campaign.blockchain_campaign_id || campaign.id;

      await contract.methods
        .withdrawFunds(parseInt(blockchainCampaignId))
        .send({ from: accounts[0] });

      await setCampaignInactive();
      alert("Funds successfully withdrawn!");
      window.location.reload();
    } catch (err) {
      console.error("Withdraw failed", err);
      alert("Withdraw failed! Cek console/log Metamask.");
    }
  };

  const setCampaignInactive = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await fetch(`http://localhost:5000/api/admins/campaigns/${id}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "inactive" }),
      });
    } catch (e) {
      console.error("Failed to set campaign inactive:", e);
    }
  };

  // Helper untuk fetch data dari IPFS
  const fetchFromIPFS = async (cid) => {
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const response = await fetch(ipfsUrl);
    const data = await response.json();
    return data;
  };

  if (isLoading) return <p>Loading...</p>;
  if (!campaign) return <p>Campaign not found.</p>;

  return (
    <div className="campaign-detail-container">
      <div className="campaign-detail-left">
        <h1>{title}</h1>

        <div className="campaign-image-wrapper">
          <img
            src={`${campaign.image_url}`}
            alt={title}
            className="campaign-image"
          />
        </div>

        <div className="campaign-description">
          <p>{description}</p>
        </div>

        <div className="campaign-info">
          <p>
            <strong>Deadline:</strong> {deadline}
          </p>
        </div>

        <div className="campaign-organizer">
          <img
            src={
              campaign.profile_photo
                ? `http://localhost:5000/uploads/profiles/admins/${campaign.profile_photo}`
                : "/default-avatar.png"
            }
            alt="Organizer"
            className="organizer-avatar"
            style={{
              objectFit: "cover",
              borderRadius: "100px",
              width: "45px",
              height: "45px",
            }}
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
            {contractGoal} ETH <span>/ Target</span>
          </h3>
          {console.log("Ini adalah amount goal", contractGoal)}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${animatedProgress}%`,
                transition: "width 1.3s cubic-bezier(0.22, 1, 0.36, 1)",
                background: "linear-gradient(90deg,#27ae60 0%,#00c9ff 100%)",
              }}
            ></div>
          </div>
          <div style={{ fontWeight: "bold", fontSize: "13px", marginTop: 6 }}>
            {Math.round(animatedProgress)}%
          </div>
        </div>

        <div className="donation-form">
          <p className="form-title">🔥 Fund this campaign</p>
          <p className="usd-estimate">~ $950.00</p>
          <button
            className="withdraw-button"
            style={{ marginTop: "12px", background: "#e74c3c", color: "#fff" }}
            onClick={handleWithdraw}
          >
            🏦 Withdraw Funds
          </button>
          <p className="note">
            Not only numbers make the difference on our lives
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail_Admin;
