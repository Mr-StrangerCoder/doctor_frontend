import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";

const Appointments = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";

  const [appointments, setAppointments] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [bookForm, setBookForm] = useState({ doctorId: "", date: "", time: "" });
  const [showBookForm, setShowBookForm] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  useEffect(() => {
    fetchAppointments();
    if (role === "user") fetchDoctors();
  }, [role]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let res;
      if (role === "admin")       res = await axiosInstance.get("appointment/getAllAppointments");
      else if (role === "doctor") res = await axiosInstance.get("appointment/getAppointmentOfDoctor");
      else                        res = await axiosInstance.get("appointment/getAppointmentsByUser");
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get("doctor/doctors");
      setAllDoctors(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.patch(`appointment/statusUpdate/${id}`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      showToast(`Appointment ${status === "accept" ? "accepted" : "rejected"}!`);
    } catch (err) {
      showToast("Failed to update status", "danger");
    }
  };

  const handleCancel = async (id) => {
    try {
      await axiosInstance.delete(`appointment/deleteAppointment/${id}`);
      setAppointments(prev => prev.filter(a => a._id !== id));
      showToast("Appointment cancelled!");
    } catch (err) {
      showToast("Failed to cancel", "danger");
    }
  };

  const handleBookChange = (e) => setBookForm({ ...bookForm, [e.target.name]: e.target.value });

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("appointment/bookAppointment", bookForm);
      showToast("Appointment booked successfully!");
      setBookForm({ doctorId: "", date: "", time: "" });
      setShowBookForm(false);
      fetchAppointments();
    } catch (err) {
      showToast("Failed to book appointment", "danger");
    }
  };

  const statusBadge = (status) => {
    if (status === "accept") return <span className="badge bg-success">Accepted</span>;
    if (status === "reject") return <span className="badge bg-danger">Rejected</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
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

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0" style={{ color: "#0F6E56" }}>
            📅 {role === "admin" ? "All Appointments" : "My Appointments"}
          </h5>
          <small className="text-muted">{appointments.length} total</small>
        </div>
        {role === "user" && (
          <button
            onClick={() => setShowBookForm(!showBookForm)}
            className="btn btn-sm fw-semibold text-white rounded-3"
            style={{ background: "linear-gradient(135deg, #1D9E75, #0F6E56)", border: "none", fontSize: "13px" }}
          >
            {showBookForm ? "✕ Close" : "➕ Book Appointment"}
          </button>
        )}
      </div>

      {/* Book Form - user only */}
      {role === "user" && showBookForm && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3" style={{ color: "#0F6E56" }}>Book New Appointment</h6>
            <form onSubmit={handleBookSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px" }}>Select Doctor</label>
                  <select name="doctorId" className="form-select form-select-sm rounded-3" value={bookForm.doctorId} onChange={handleBookChange} required>
                    <option value="" disabled>Choose a doctor...</option>
                    {allDoctors.map(d => (
                      <option key={d._id} value={d._id}>
                        {d.user_id?.name || "Doctor"} — {d.specialization || "General"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px" }}>Date</label>
                  <input type="date" name="date" className="form-control form-control-sm rounded-3" value={bookForm.date} onChange={handleBookChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px" }}>Time</label>
                  <input type="time" name="time" className="form-control form-control-sm rounded-3" value={bookForm.time} onChange={handleBookChange} required />
                </div>
              </div>
              <button type="submit" className="btn mt-3 fw-semibold rounded-3 text-white px-4"
                style={{ background: "linear-gradient(135deg, #1D9E75, #0F6E56)", border: "none", fontSize: "13px" }}>
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Appointments Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#0F6E56" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>#</th>
                {role === "admin"  && <><th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Patient</th><th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Doctor</th></>}
                {role === "doctor" && <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Patient</th>}
                {role === "user"   && <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Doctor</th>}
                <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Date</th>
                <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Time</th>
                <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Status</th>
                {role !== "admin" && <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? appointments.map((a, i) => (
                <tr key={a._id}>
                  <td className="small text-muted align-middle">{i + 1}</td>
                  {role === "admin"  && <><td className="small fw-semibold align-middle">{a.userId?.name || "—"}</td><td className="small text-muted align-middle">{a.doctorId?.name || "—"}</td></>}
                  {role === "doctor" && <td className="small fw-semibold align-middle">{a.userId?.name || "—"}</td>}
                  {role === "user"   && <td className="small fw-semibold align-middle">{a.doctorId?.name || "—"}</td>}
                  <td className="small text-muted align-middle">{a.date || "—"}</td>
                  <td className="small text-muted align-middle">{a.time || "—"}</td>
                  <td className="align-middle">{statusBadge(a.status)}</td>
                  {role === "doctor" && (
                    <td className="align-middle">
                      <button onClick={() => handleStatusUpdate(a._id, "accept")} className="btn btn-success btn-sm me-1" style={{ fontSize: "11px" }}>Accept</button>
                      <button onClick={() => handleStatusUpdate(a._id, "reject")} className="btn btn-danger btn-sm" style={{ fontSize: "11px" }}>Reject</button>
                    </td>
                  )}
                  {role === "user" && (
                    <td className="align-middle">
                      <button onClick={() => handleCancel(a._id)} className="btn btn-outline-danger btn-sm" style={{ fontSize: "11px" }}>Cancel</button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-5 small">No appointments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
