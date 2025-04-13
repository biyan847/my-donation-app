import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Dashboard from "./dasbord/Dashboard";
import Explore from "./explore/Explore";
import Register from "./register/Register";
import Login from "./login/Login";
import Navbar from "./components/Navbar";
import Campaign from "./campaign/Campaign";
import CreateCampaign from "./create_campaign/CreateCampaign";
import CampaignDetail from "./detail/CampaignDetail";

function AppRoutes() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/register" || location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Home */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/campaigns" element={<Campaign />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
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
