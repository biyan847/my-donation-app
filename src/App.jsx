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

function AppRoutes() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/register" || location.pathname === "/login";

  const isAdminRoute =
    location.pathname.startsWith("/dasboardadmin") ||
    location.pathname.startsWith("/exploreadmin");

  return (
    <>
      {!hideNavbar && (isAdminRoute ? <Navbar_Admin /> : <Navbar />)}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/campaigns" element={<Campaign />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/settings" element={<Setting />} />

        {/* Admin */}
        <Route path="/dasboardadmin" element={<Dashboard_Admin />} />
        <Route path="/exploreadmin" element={<Explore_Admin />} />
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
