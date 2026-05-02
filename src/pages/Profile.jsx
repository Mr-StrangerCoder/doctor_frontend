import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("user/getUserInfo");
        setProfile(res.data?.user || res.data || null);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: "#0F6E56" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const data = profile || user;

  return (
    <div>
      <h5 className="fw-bold mb-1" style={{ color: "#0F6E56" }}>👤 My Profile</h5>
      <p className="text-muted small mb-4">Your personal information</p>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 text-center">
            <div className="card-body p-4">
              {data?.img_path ? (
                <img src={data.img_path} alt="profile"
                  className="rounded-circle mb-3 border border-3"
                  style={{ width: "90px", height: "90px", objectFit: "cover", borderColor: "#1D9E75 !important" }} />
              ) : (
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-3"
                  style={{ width: "90px", height: "90px", background: "linear-gradient(135deg, #1D9E75, #04342C)", fontSize: "32px" }}>
                  {data?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <h6 className="fw-bold mb-1">
                {role === "doctor" ? "Dr. " : ""}{data?.name || "—"}
              </h6>
              <p className="text-muted small mb-2">{data?.email || "—"}</p>
              <span className={`badge ${role === "admin" ? "bg-danger" : role === "doctor" ? "bg-success" : "bg-primary"}`}>
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0F6E56" }}>Personal Details</h6>
              {[
                ["Full Name",       data?.name          || "—"],
                ["Email",          data?.email          || "—"],
                ["Contact Number", data?.contactNumber  || "—"],
                ["Gender",         data?.gender         || "—"],
                ["Date of Birth",  data?.DOB ? new Date(data.DOB).toLocaleDateString() : "—"],
                ["Role",           data?.role           || "—"],
              ].map(([k, v], i, arr) => (
                <div key={i} className={`d-flex justify-content-between py-2 ${i < arr.length - 1 ? "border-bottom" : ""}`} style={{ fontSize: "13px" }}>
                  <span className="text-muted">{k}</span>
                  <span className="fw-semibold" style={{ color: "#0F6E56" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
