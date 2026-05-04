import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";

const ITEMS_PER_PAGE = 15;

const Appointments = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";

  const [appointments, setAppointments] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [bookForm, setBookForm] = useState({ doctor_id: "", date_time: "" });
  const [showBookForm, setShowBookForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
      setAppointments(res.data?.apps || []);
      setCurrentPage(1); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get("user/getAllDoctors");
      setAllDoctors(res.data?.doctors || []);
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
      await axiosInstance.delete(`appointment/delAppointment/${id}`);
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
      await axiosInstance.post("appointment/createAppointment", {
        user_id:   user._id,
        doctor_id: bookForm.doctor_id,
        date_time: bookForm.date_time,
      });
      showToast("Appointment booked successfully!");
      setBookForm({ doctor_id: "", date_time: "" });
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

  //Pagination
  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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

      {/* Book Form */}
      {role === "user" && showBookForm && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3" style={{ color: "#0F6E56" }}>Book New Appointment</h6>
            <form onSubmit={handleBookSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px" }}>Select Doctor</label>
                  <select name="doctor_id" className="form-select form-select-sm rounded-3" value={bookForm.doctor_id} onChange={handleBookChange} required>
                    <option value="" disabled>Choose a doctor...</option>
                    {allDoctors.map(d => (
                      <option key={d._id} value={d._id}>
                        {d.user_id?.name || "Doctor"} — {d.specialization || "General"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px" }}>Date & Time</label>
                  <input type="datetime-local" name="date_time" className="form-control form-control-sm rounded-3" value={bookForm.date_time} onChange={handleBookChange} required />
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

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#0F6E56" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>#</th>
                  {role === "admin"  && <><th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Patient</th><th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Doctor</th></>}
                  {role === "doctor" && <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Patient</th>}
                  {role === "user"   && <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Doctor</th>}
                  <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Date & Time</th>
                  <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Status</th>
                  {role !== "admin" && <th className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px" }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedAppointments.length > 0 ? paginatedAppointments.map((a, i) => (
                  <tr key={a._id}>
                    <td className="small text-muted align-middle">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                    {role === "admin"  && <><td className="small fw-semibold align-middle">{a.user_name || "—"}</td><td className="small text-muted align-middle">{a.doctor_name || "—"}</td></>}
                    {role === "doctor" && <td className="small fw-semibold align-middle">{a.user_name || "—"}</td>}
                    {role === "user"   && <td className="small fw-semibold align-middle">{a.doctor_name || "—"}</td>}
                    <td className="small text-muted align-middle">
                      {a.date_time ? new Date(a.date_time).toLocaleString() : "—"}
                    </td>
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

        
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, appointments.length)} of {appointments.length}
              </small>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>‹</button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                        style={currentPage === i + 1 ? { background: "#0F6E56", borderColor: "#0F6E56" } : {}}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>›</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Appointments;
