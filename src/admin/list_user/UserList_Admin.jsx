import React, { useEffect, useState } from "react";
import "./AdminUserList.css"; // pakai styling yang sudah ada agar konsisten
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const UserList_Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken"); // pastikan token tersimpan saat login admin

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/admins/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleVerifyUser = async (userId) => {
    if (!window.confirm("Verifikasi user ini?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admins/verify-user/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Gagal verifikasi user");
        return;
      }
      alert("User berhasil diverifikasi");
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, is_verified: true } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat verifikasi user");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-container">
      <h1>Daftar User Mahasiswa</h1>
      <p>Kelola user mahasiswa yang mendaftar di sistem</p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              ID
            </th>
            <th
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Username
            </th>
            <th
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              NIM
            </th>
            <th
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Email
            </th>
            <th
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              Status Verifikasi
            </th>
            <th
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                Belum ada user terdaftar.
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr
              key={user.id}
              style={{
                backgroundColor: user.is_verified ? "#e6ffe6" : "#ffe6e6",
              }}
            >
              <td style={{ padding: "8px" }}>{user.id}</td>
              <td style={{ padding: "8px" }}>{user.username}</td>
              <td style={{ padding: "8px" }}>{user.nim}</td>
              <td style={{ padding: "8px" }}>{user.email}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>
                {user.is_verified ? (
                  <FaCheckCircle color="green" title="Terverifikasi" />
                ) : (
                  <FaTimes color="red" title="Belum diverifikasi" />
                )}
              </td>
              <td style={{ padding: "8px", textAlign: "center" }}>
                {!user.is_verified && (
                  <button
                    onClick={() => handleVerifyUser(user.id)}
                    style={{
                      backgroundColor: "#36c24d",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Verifikasi
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList_Admin;
