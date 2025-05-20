import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Dashboard from "../src/user/dasbord/Dashboard";
import Explore from "./user/explore/Explore";
import Register from "./user/register/Register";
import Login from "./user/login/Login";
import Navbar from "./user/dasbord/Navbar";
import Campaign from "./user/campaign/Campaign";
import CreateCampaign from "./user/create_campaign/CreateCampaign";
import CampaignDetail from "./user/detail/CampaignDetail";
import Setting from "./components/Settings";

import Dashboard_Admin from "./admin/dasbord_admin/Dashboard_Admin";
import Explore_Admin from "./admin/explore_admin/Explore_Admin";
import Navbar_Admin from "./admin/dasbord_admin/Navbar_Admin";
import { useEffect } from "react";

import ProtectedRoute from "./components/ProtectedRoute"; // <== Tambahkan ini
import AdminProtectedRoute from "./admin/admin_login/AdminProtectedRoute"; // <-- tambahan
import AdminLogin from "./admin/admin_login/AdminLogin";

import CampaignDetail_Admin from "./admin/detail_campaign_admin/CampaignDetail_Admin";

function AppRoutes() {
  useEffect(() => {
    // Tandai saat user aktif di halaman
    sessionStorage.setItem("stayOpen", "true");

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Tab jadi tidak aktif (bisa pindah tab / mau ditutup)
        sessionStorage.setItem("stayOpen", "false");
      }
    };

    const handlePageHide = () => {
      const stayOpen = sessionStorage.getItem("stayOpen");
      console.log(">> pagehide fired. stayOpen =", stayOpen); // ✅ debug log
      if (stayOpen === "false") {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userProfile");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        console.log(">> Token dan data berhasil dihapus.");
      }
    };

    const handleBeforeUnload = () => {
      // 🔒 Tambahan untuk Chrome dan browser lain yang agresif
      localStorage.removeItem("userToken");
      localStorage.removeItem("userProfile");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload); // ✅ di sini

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const location = useLocation();
  const hideNavbar =
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/admin-login";

  const isAdminRoute =
    location.pathname.startsWith("/dasboardadmin") ||
    location.pathname.startsWith("/exploreadmin") ||
    location.pathname.startsWith("/admin/campaign");

  return (
    <>
      {!hideNavbar && (isAdminRoute ? <Navbar_Admin /> : <Navbar />)}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Dibungkus dengan ProtectedRoute */}
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <Campaign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-campaign"
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaign/:id"
          element={
            <ProtectedRoute>
              <CampaignDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />

        {/* Admin route tetap bisa diatur terpisah */}
        <Route
          path="/dasboardadmin"
          element={
            <AdminProtectedRoute>
              <Dashboard_Admin />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/exploreadmin"
          element={
            <AdminProtectedRoute>
              <Explore_Admin />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/campaign/:id"
          element={
            <AdminProtectedRoute>
              <CampaignDetail_Admin />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
