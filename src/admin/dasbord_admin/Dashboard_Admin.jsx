import React, { useEffect, useState } from "react";
import "./Dashboard_Admin.css";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SiTiktok } from "react-icons/si";
import Navbar from "./Navbar_Admin"; // pastikan path sesuai struktur folder
import logoKmft from "../../assets/LOGO-BEM-NOBG.png";
// Atau sesuaikan path, misal jika Dashboard_Admin.jsx ada di /src/admin/dasbord_admin

const Dashboard_Admin = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/admin-login");
    } else {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) {
    // Selama pengecekan token, jangan render dashboard apapun (bisa kasih loader jika mau)
    return null;
  }

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
        </div>
      </section>
      <footer className="footer">
        <div className="footer-container">
          <img src={logoKmft} alt="Logo BEM KMFT" className="footer-logo" />
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
    </>
  );
};

export default Dashboard_Admin;
