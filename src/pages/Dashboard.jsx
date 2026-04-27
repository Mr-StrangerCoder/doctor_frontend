import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../authRedux/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user?.name || "User"} 👋</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Role</h5>
            <p className="text-capitalize fw-bold">{user?.role || "user"}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Email</h5>
            <p>{user?.email || "—"}</p>
          </div>
        </div>
      </div>

      <p className="text-muted mt-3">Dashboard content coming soon...</p>
    </div>
  );
};

export default Dashboard;
