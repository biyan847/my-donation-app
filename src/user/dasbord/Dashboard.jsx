import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import Navbar from "../dasbord/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Contoh cek token di localStorage
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>Dukung Program dan Kegiatan Mahasiswa Fakultas Teknik</h1>
          <p>
            Bergabunglah dalam kampanye donasi BEM KMFT untuk mendukung
            pengembangan kemahasiswaan dan kegiatan sosial di lingkungan
            Fakultas Teknik.
          </p>

          {/* Hanya tampilkan tombol Donasi kalau belum login */}
          {!isLoggedIn && (
            <button
              className="get-started"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          )}

          {/* Hanya tampilkan teks login kalau belum login */}
          {!isLoggedIn && (
            <p className="login-text">
              Sudah punya akun?{" "}
              <span className="login-linkdb" onClick={() => navigate("/login")}>
                Masuk
              </span>
            </p>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-about">
            <h3>Tentang Kami</h3>
            <p>
              Platform resmi donasi BEM KMFT yang mendukung program
              kemahasiswaan dan kegiatan sosial di Fakultas Teknik. Transparan,
              aman, dan dikelola oleh mahasiswa untuk mahasiswa.
            </p>
          </div>

          <div className="footer-contact">
            <h4>Kontak Kami</h4>
            <p>Email: officialbemkmftumy@gmail.com</p>
            <p>HP: +62 812 3456 7890</p>
            <p>
              Alamat: Gedung Fakultas Teknik, Universitas Universitas
              Muhammadiyah Yogyakarta
            </p>
            <p>Jam Operasional: Senin - Jumat, 08.00 - 16.00</p>
          </div>

          <div className="footer-social">
            <h4>Sosial Media</h4>
            <div className="social-icons">
              <a
                href="https://www.instagram.com/bemkmftumy_/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@bemkmftumy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiTiktok size={20} />
              </a>
              <a
                href="https://www.youtube.com/@BEMKMFT"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} BEM KMFT Fakultas Teknik. All rights
          reserved.
        </div>
      </footer>
      {/* FOOTER END */}
    </>
  );
};

export default Dashboard;
