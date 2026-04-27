import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isAuthenticate } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  return isAuthenticate || token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
