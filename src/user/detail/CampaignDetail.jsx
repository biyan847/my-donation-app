import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import DonationEscrow from "../../contracts/DonationEscrow.json";
import "./CampaignDetail.css";

const CONTRACT_ADDRESS = "0x659736c9e4F2ea03FDEc77d30858963Ea0B819BA";

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState("");
  const [contractProgress, setContractProgress] = useState(0);
  const [_isCompleted, setIsCompleted] = useState(false);

  // State untuk data dari IPFS
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState(0);
  const [deadline, setDeadline] = useState("");

  // ===== LANGKAH 1: Tambahkan State untuk Riwayat Donasi =====
  const [donationHistory, setDonationHistory] = useState([]);

  // Helper untuk fetch data dari IPFS
  const fetchFromIPFS = async (cid) => {
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const response = await fetch(ipfsUrl);
    const data = await response.json();
    return data;
  };

  // ===== LANGKAH 2: Ambil Data Riwayat dari Smart Contract =====
  // Menggunakan useCallback agar fungsi tidak dibuat ulang di setiap render
  const fetchContractData = useCallback(async () => {
    try {
      if (!window.ethereum) {
        console.warn("MetaMask is not installed.");
        return;
      }
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        DonationEscrow.abi,
        CONTRACT_ADDRESS
      );

      // 1. Ambil Progress Campaign (kode yang sudah ada)
      const campaignData = await contract.methods
        .getCampaign(parseInt(id))
        .call();
      const goal = parseFloat(web3.utils.fromWei(campaignData.goal, "ether"));
      const balance = parseFloat(
        web3.utils.fromWei(campaignData.balance, "ether")
      );
      const percent = goal > 0 ? Math.min((balance / goal) * 100, 100) : 0;

      setContractProgress(percent);
      setIsCompleted(campaignData.completed);

      // 2. Ambil Riwayat Donasi (logika baru)
      const historyData = await contract.methods
        .getDonationHistory(parseInt(id))
        .call();
      const donors = historyData[0];
      const amounts = historyData[1];

      // Format data agar mudah ditampilkan
      const formattedHistory = donors
        .map((donor, index) => ({
          id: index,
          donorAddress: donor,
          amount: web3.utils.fromWei(amounts[index], "ether"),
        }))
        .reverse(); // .reverse() untuk menampilkan donasi terbaru di atas

      setDonationHistory(formattedHistory);
    } catch (err) {
      console.error("Failed to fetch blockchain data:", err);
    }
  }, [id]);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      setIsLoading(true);
      try {
        // Ambil detail dari backend
        const res = await fetch(`http://localhost:5000/api/campaigns/${id}`);
        const data = await res.json();
        if (res.ok) {
          setCampaign(data);
          // Ambil data dari IPFS
          const ipfsData = await fetchFromIPFS(data.ipfs_cid);
          if (ipfsData) {
            setTitle(ipfsData.title);
            setDescription(ipfsData.description);
            setGoalAmount(ipfsData.goal_amount);
            setDeadline(ipfsData.deadline);
          }
        } else {
          console.error(data.message);
          setCampaign(null); // Set campaign jadi null jika error
        }
      } catch (err) {
        console.error("Failed to fetch campaign detail", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignDetail();
    fetchContractData(); // Panggil fungsi yang mengambil data dari contract
  }, [id, fetchContractData]);

  const handleDonate = async () => {
    // ... (Fungsi handleDonate Anda tidak perlu diubah)
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("Please login first.");
        return;
      }

      if (
        !donationAmount ||
        isNaN(donationAmount) ||
        Number(donationAmount) <= 0
      ) {
        alert("Enter a valid donation amount.");
        return;
      }

      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        DonationEscrow.abi,
        CONTRACT_ADDRESS
      );

      const contractCampaign = await contract.methods
        .getCampaign(parseInt(id))
        .call();

      if (contractCampaign.completed) {
        alert("Campaign has already reached its goal.");
        return;
      }

      await contract.methods
        .donateToCampaign(parseInt(id))
        .send({
          from: accounts[0],
          value: web3.utils.toWei(donationAmount, "ether"),
        })
        .on("receipt", function () {
          alert("Terima kasih! Donasi berhasil.");
          fetchContractData(); // refresh data campaign
        })
        .on("error", function (err) {
          console.error("Terjadi error setelah transaksi:", err);
          alert(
            "Transaksi berhasil di blockchain, namun sistem gagal memuat ulang data. Silakan cek ulang beberapa saat lagi."
          );
        });
    } catch (err) {
      console.error("Donation failed:", err);
      alert("Donation failed. See console for details.");
    }
  };

  // Helper untuk memotong alamat wallet
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  if (isLoading) return <p>Loading...</p>;
  if (!campaign) return <p>Campaign not found.</p>;

  const goal = parseFloat(goalAmount) || 0;
  const contractEth = (goal * contractProgress) / 100;
  const kekurangan = Math.max(goal - contractEth, 0).toFixed(2);

  return (
    <div className="campaign-detail-container">
      <div className="campaign-detail-left">
        {/* ... (Kode kolom kiri Anda tidak berubah) ... */}
        <h1>{title}</h1>
        <div className="campaign-image-wrapper">
          <img
            src={`http://localhost:5000/${campaign.image_url}`}
            alt={campaign.title}
            className="campaign-image"
          />
        </div>
        <div className="campaign-description">
          <p className="desc">{description}</p>
        </div>
        <div className="donation-deadline">
          <p>
            <strong>Deadline Donasi:</strong> {deadline}
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
          {/* ... (Kode progress bar Anda tidak berubah) ... */}
          <p className="progress-label">🔥 Dana terkumpul untuk kampanye ini</p>
          <h3 className="donation-amount">
            {goalAmount} ETH <span>/ Target</span>
          </h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${contractProgress}%` }}
            ></div>
          </div>
          <div
            style={{
              marginTop: 8,
              fontWeight: "bold",
              color: kekurangan > 0 ? "#F44336" : "#4CAF50",
            }}
          >
            {kekurangan > 0 && contractProgress < 100
              ? `Kurang: ${kekurangan} ETH lagi untuk mencapai target`
              : contractProgress >= 100
              ? "Target sudah tercapai 🎉"
              : `Sudah terkumpul ${contractProgress.toFixed(2)}% dari target`}
          </div>
        </div>

        <div className="donation-form">
          {/* ... (Kode form donasi Anda tidak berubah) ... */}
          <p className="form-title">🔥 Danai kampanye ini</p>
          <input
            type="number"
            placeholder="0.50 ETH"
            className="eth-input"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
          />
          <p className="usd-estimate">~ $950.00</p>
          <textarea
            placeholder="Pesan dukungan 💌"
            className="support-textarea"
          ></textarea>

          <button
            className="donate-button"
            onClick={handleDonate}
            disabled={contractProgress >= 100 || _isCompleted}
            style={{
              opacity: contractProgress >= 100 || _isCompleted ? 0.5 : 1,
              cursor:
                contractProgress >= 100 || _isCompleted
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            💚 donasi
          </button>

          <p className="note">
            Bukan hanya angka yang membuat perbedaan dalam hidup kita :)
          </p>
        </div>

        {/* ===== LANGKAH 3: Tampilkan Riwayat Donasi di JSX ===== */}
        <div className="donation-history-in-column">
          <h3 className="history-title">Donatur Terbaru</h3>
          <div className="history-list">
            {donationHistory.length > 0 ? (
              donationHistory.map((donation) => (
                <div key={donation.id} className="donation-entry">
                  <div className="donor-info">
                    <p className="donor-address" title={donation.donorAddress}>
                      {shortenAddress(donation.donorAddress)}
                    </p>
                  </div>
                  <p className="donation-amount-history">
                    {parseFloat(donation.amount).toFixed(4)} ETH
                  </p>
                </div>
              ))
            ) : (
              <p className="no-history">Jadilah donatur pertama!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
