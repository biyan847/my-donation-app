import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const isAdmin = localStorage.getItem("admin");
  console.log("[AdminProtectedRoute]", { token, isAdmin });
  if (!token || isAdmin !== "true") {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

export default AdminProtectedRoute;
