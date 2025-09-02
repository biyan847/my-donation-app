import React, { useState } from "react";
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
import CampaignDetail from "./user/detail/CampaignDetail";
import Setting from "./components/Settings";

import Dashboard_Admin from "./admin/dasbord_admin/Dashboard_Admin";
import Explore_Admin from "./admin/explore_admin/Explore_Admin";
import Navbar_Admin from "./admin/dasbord_admin/Navbar_Admin";
import { useRef, useEffect } from "react";

import ProtectedRoute from "./components/ProtectedRoute"; // <== Tambahkan ini
import AdminProtectedRoute from "./admin/admin_login/AdminProtectedRoute"; // <-- tambahan
import AdminLogin from "./admin/admin_login/AdminLogin";

import CampaignDetail_Admin from "./admin/detail_campaign_admin/CampaignDetail_Admin";
import CreateCampaign_Admin from "./admin/create_campaign/CreateCampaign_Admin";

import IntroVideo from "./components/IntroVideo";
import ForgotPassword from "./user/login/ForgotPassword";
import Register_Admin from "./admin/register_admin/Register_Admin";
function AppRoutes() {
  const logoutTimer = useRef(null);
  useEffect(() => {
    const logoutUser = () => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userProfile");
      // window.location.href = "/login";
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // SET timer logout, misal 30 detik (30000 ms)
        logoutTimer.current = setTimeout(() => {
          logoutUser();
        }, 30000); // 30 detik
      } else if (document.visibilityState === "visible") {
        // Tab aktif lagi, cancel timer logout
        if (logoutTimer.current) {
          clearTimeout(logoutTimer.current);
          logoutTimer.current = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, []);

  const location = useLocation();
  const hideNavbar =
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/admin-login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/register-admin";

  const isAdminRoute =
    location.pathname.startsWith("/dashboardadmin") ||
    location.pathname.startsWith("/exploreadmin") ||
    location.pathname.startsWith("/admin/campaign") ||
    location.pathname.startsWith("/createcampaignadmin");

  return (
    <>
      {!hideNavbar && (isAdminRoute ? <Navbar_Admin /> : <Navbar />)}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register-admin" element={<Register_Admin />} />

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
          path="/dashboardadmin"
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

        <Route
          path="/createcampaignadmin"
          element={
            <AdminProtectedRoute>
              <CreateCampaign_Admin />
            </AdminProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [dashboardReady, setDashboardReady] = useState(false);
  const [hideSplash, setHideSplash] = useState(false);

  return (
    <>
      {/* Splash screen selalu render lebih dulu */}
      <IntroVideo
        onShowDashboard={() => setDashboardReady(true)}
        onEnd={() => setHideSplash(true)}
      />
      {/* Dashboard mulai render hanya setelah onShowDashboard terpanggil */}
      {dashboardReady && (
        <div
          style={{
            minHeight: "100vh",
            minWidth: "100vw",
          }}
        >
          <Router>
            <AppRoutes />
          </Router>
        </div>
      )}
    </>
  );
}
