import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";

const Doctors = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";

  const [doctors, setDoctors] = useState([]);
  const [appliedDoctors, setAppliedDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState("approved");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  useEffect(() => {
    fetchDoctors();
    if (role === "admin") fetchAppliedDoctors();
  }, [role]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("doctor/doctors");
      setDoctors(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedDoctors = async () => {
    try {
      const res = await axiosInstance.get("doctor/appliedDoctors");
      setAppliedDoctors(res.data?.doctorsList || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(`doctor/isDoctor/${id}`);
      setAppliedDoctors(prev => prev.map(d => d._id === id ? { ...d, isDoctor: true } : d));
      showToast("Doctor approved!");
      fetchDoctors();
    } catch (err) {
      showToast("Failed to approve", "danger");
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast.msg && (
        <div className={`alert alert-${toast.type} py-2 small fw-semibold position-fixed`}
          style={{ top: "80px", right: "16px", zIndex: 9999, minWidth: "260px" }}>
          {toast.msg}
        </div>
      )}

      <h5 className="fw-bold mb-1" style={{ color: "#0F6E56" }}>🩺 Doctors</h5>
      <p className="text-muted small mb-4">{doctors.length} approved doctors</p>

      {/* Admin Tabs */}
      {role === "admin" && (
        <div className="d-flex gap-2 mb-4">
          {[
            { key: "approved", label: "Approved Doctors" },
            { key: "applied",  label: `Applications (${appliedDoctors.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`btn btn-sm rounded-3 fw-semibold ${activeTab === t.key ? "text-white" : "btn-light border"}`}
              style={activeTab === t.key ? { background: "linear-gradient(135deg, #1D9E75, #0F6E56)", border: "none", fontSize: "13px" } : { fontSize: "13px" }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#0F6E56" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Approved Doctors */}
          {(activeTab === "approved" || role !== "admin") && (
            <div className="row g-3">
              {doctors.length > 0 ? doctors.map((d) => (
                <div className="col-md-4" key={d._id}>
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{ width: "46px", height: "46px", background: "linear-gradient(135deg, #1D9E75, #04342C)", fontSize: "18px", flexShrink: 0 }}>
                          {d.user_id?.name?.charAt(0)?.toUpperCase() || "D"}
                        </div>
                        <div>
                          <div className="fw-bold small">Dr. {d.user_id?.name || "—"}</div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>{d.specialization || "General"}</div>
                        </div>
                      </div>
                      {[
                        ["Qualification", d.Qualification || d.qualification || "—"],
                        ["Fees",          d.fees ? `₹${d.fees}` : "—"],
                        ["Experience",    d.experience ? `${d.experience} yrs` : "—"],
                      ].map(([k, v], i) => (
                        <div key={i} className={`d-flex justify-content-between py-1 ${i < 2 ? "border-bottom" : ""}`} style={{ fontSize: "12px" }}>
                          <span className="text-muted">{k}</span>
                          <span className="fw-semibold" style={{ color: "#0F6E56" }}>{v}</span>
                        </div>
                      ))}
                      <span className="badge bg-success mt-2">✓ Approved</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center text-muted py-5 small">No approved doctors found</div>
              )}
            </div>
          )}

          {/* Applied Doctors (admin only) */}
          {role === "admin" && activeTab === "applied" && (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    {["#", "Name", "Specialization", "Qualification", "Fees", "Status", "Action"].map(h => (
                      <th key={h} className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appliedDoctors.length > 0 ? appliedDoctors.map((d, i) => (
                    <tr key={d._id}>
                      <td className="small text-muted align-middle">{i + 1}</td>
                      <td className="small fw-semibold align-middle">{d.user_id?.name || "—"}</td>
                      <td className="small text-muted align-middle">{d.specialization || "—"}</td>
                      <td className="small text-muted align-middle">{d.Qualification || d.qualification || "—"}</td>
                      <td className="small text-muted align-middle">{d.fees ? `₹${d.fees}` : "—"}</td>
                      <td className="align-middle">
                        <span className={`badge ${d.isDoctor ? "bg-success" : "bg-warning text-dark"}`}>
                          {d.isDoctor ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="align-middle">
                        {!d.isDoctor
                          ? <button onClick={() => handleApprove(d._id)} className="btn btn-success btn-sm" style={{ fontSize: "11px" }}>Approve</button>
                          : <span className="text-success small fw-semibold">✓ Done</span>
                        }
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7} className="text-center text-muted py-5 small">No applications found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Doctors;
