import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (role === "admin") {
          const res = await axiosInstance.get("appointment/getAllAppointments");
          setAppointments(res.data.appointments || []);
        } else if (role === "doctor") {
          const res = await axiosInstance.get("appointment/getAppointmentOfDoctor");
          setAppointments(res.data.appointments || []);
        } else {
          const res = await axiosInstance.get("appointment/getAppointmentsByUser");
          setAppointments(res.data.appointments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [role]);

  const stats = role === "admin"
    ? [
        { label: "Total Appointments", icon: "📅", color: "success", value: appointments.length },
        { label: "Pending",            icon: "⏳", color: "warning", value: appointments.filter(a => a.status === "pending").length },
        { label: "Accepted",           icon: "✅", color: "info",    value: appointments.filter(a => a.status === "accept").length },
        { label: "Rejected",           icon: "❌", color: "danger",  value: appointments.filter(a => a.status === "reject").length },
      ]
    : [
        { label: "Total Appointments", icon: "📅", color: "success", value: appointments.length },
        { label: "Pending",            icon: "⏳", color: "warning", value: appointments.filter(a => a.status === "pending").length },
        { label: "Accepted",           icon: "✅", color: "info",    value: appointments.filter(a => a.status === "accept").length },
      ];

  const colClass = role === "admin" ? "col-3" : "col-4";

  return (
    <div>
      <h5 className="fw-bold mb-1" style={{ color: "#0F6E56" }}>📊 Overview</h5>
      <p className="text-muted small mb-4">Welcome back, {role === "doctor" ? "Dr. " : ""}{user?.name}!</p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#0F6E56" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            {stats.map((c, i) => (
              <div className={colClass} key={i}>
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body">
                    <div className="fs-3 mb-2">{c.icon}</div>
                    <h4 className={`fw-bold text-${c.color} mb-1`}>{c.value}</h4>
                    <small className="text-muted">{c.label}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Guide */}
          <div className="row g-3">
            <div className="col-md-5">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <h6 className="fw-bold mb-3" style={{ color: "#0F6E56" }}>Appointment Status Guide</h6>
                  {[
                    ["pending", "bg-warning text-dark", "Waiting for doctor response"],
                    ["accept",  "bg-success",           "Doctor confirmed your appointment"],
                    ["reject",  "bg-danger",            "Doctor rejected your appointment"],
                  ].map(([s, cls, desc], i) => (
                    <div key={i} className={`d-flex align-items-center gap-2 py-2 ${i < 2 ? "border-bottom" : ""}`} style={{ fontSize: "12px" }}>
                      <span className={`badge ${cls}`}>{s}</span>
                      <span className="text-muted">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <h6 className="fw-bold mb-3" style={{ color: "#0F6E56" }}>Your Info</h6>
                  {[
                    ["Name",    user?.name    || "—"],
                    ["Email",   user?.email   || "—"],
                    ["Role",    user?.role    || "—"],
                    ["Gender",  user?.gender  || "—"],
                  ].map(([k, v], i) => (
                    <div key={i} className={`d-flex justify-content-between py-2 ${i < 3 ? "border-bottom" : ""}`} style={{ fontSize: "13px" }}>
                      <span className="text-muted">{k}</span>
                      <span className="fw-semibold" style={{ color: "#0F6E56" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
