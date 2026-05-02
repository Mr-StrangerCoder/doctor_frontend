import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ApplyDoctor = () => {
  const [form, setForm] = useState({
    specialization: "",
    Qualification: "",
    fees: "",
    experience: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("doctor/applyDoctor", form);
      showToast("Application submitted! Wait for admin approval.");
      setForm({ specialization: "", Qualification: "", fees: "", experience: "" });
    } catch (err) {
      showToast(err.response?.data?.msg || "Failed to submit application", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {toast.msg && (
        <div className={`alert alert-${toast.type} py-2 small fw-semibold position-fixed`}
          style={{ top: "80px", right: "16px", zIndex: 9999, minWidth: "260px" }}>
          {toast.msg}
        </div>
      )}

      <h5 className="fw-bold mb-1" style={{ color: "#0F6E56" }}>📋 Apply as Doctor</h5>
      <p className="text-muted small mb-4">Fill in your professional details. Admin will review and approve your application.</p>

      <div className="col-md-7">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    className="form-control form-control-sm rounded-3"
                    placeholder="e.g. Cardiology"
                    value={form.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="Qualification"
                    className="form-control form-control-sm rounded-3"
                    placeholder="e.g. MBBS, MD"
                    value={form.Qualification}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                    Consultation Fees (₹)
                  </label>
                  <input
                    type="number"
                    name="fees"
                    className="form-control form-control-sm rounded-3"
                    placeholder="e.g. 500"
                    value={form.fees}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    className="form-control form-control-sm rounded-3"
                    placeholder="e.g. 5"
                    value={form.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="alert alert-info py-2 small mb-4" role="alert">
                Your application will be reviewed by the admin. You will be notified once approved.
              </div>

              <button
                type="submit"
                className="btn fw-semibold rounded-3 py-2 text-white px-5"
                style={{ background: "linear-gradient(135deg, #1D9E75, #0F6E56)", border: "none", fontSize: "14px" }}
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Submitting...</>
                  : "Submit Application"
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyDoctor;
