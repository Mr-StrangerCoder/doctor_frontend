import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../authRedux/authSlice";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    gender: "",
    DOB: "",
    myFile: null,
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    if (e.target.name === "myFile") {
      setForm({ ...form, myFile: e.target.files[0] });
      setFileName(e.target.files[0]?.name || "");
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("contactNumber", form.contactNumber);
    formData.append("gender", form.gender);
    formData.append("DOB", form.DOB);
    if (form.myFile) formData.append("myFile", form.myFile);

    const res = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(res)) {
      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0F6E56, #04342C)",
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden d-flex flex-row"
        style={{ width: "900px", height: "560px" }}
      >
  
        <div
          className="d-flex flex-column justify-content-center align-items-start p-5 text-white"
          style={{
            width: "38%",
            background: "linear-gradient(160deg, #1D9E75, #04342C)",
            flexShrink: 0,
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mb-4"
            style={{
              width: "56px",
              height: "56px",
              background: "rgba(255,255,255,0.15)",
              fontSize: "26px",
            }}
          >
            🌿
          </div>
          <h2 className="fw-bold mb-2" style={{ fontSize: "24px" }}>
            Welcome Aboard!
          </h2>
          <p className="opacity-75 mb-4" style={{ fontSize: "13px", lineHeight: "1.6" }}>
            Create your account and start your journey with us today.
          </p>
          <hr className="w-100 opacity-25" />
          <p className="opacity-50 mt-3 mb-1" style={{ fontSize: "12px" }}>
            ✅ &nbsp;Free to get started
          </p>
          <p className="opacity-50 mb-1" style={{ fontSize: "12px" }}>
            ✅ &nbsp;Secure & private
          </p>
          <p className="opacity-50 mb-0" style={{ fontSize: "12px" }}>
            ✅ &nbsp;Cancel anytime
          </p>
        </div>

  
        <div
          className="d-flex flex-column justify-content-center p-4"
          style={{ width: "62%", overflowY: "auto" }}
        >
          <h5 className="fw-bold mb-1 text-dark">Create Account</h5>
          <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
            Fill in the details below to register
          </p>

          {error && (
            <div className="alert alert-danger py-2 small fw-medium" role="alert">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success py-2 small fw-medium" role="alert">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1 — Name + Email */}
            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="form-label small fw-semibold text-secondary text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-sm rounded-3"
                  placeholder=""
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold text-secondary text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-sm rounded-3"
                  // placeholder="@email.com"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 2 — Password + Contact */}
            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="form-label small fw-semibold text-secondary text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-sm rounded-3"
                  placeholder=""
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold text-secondary text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                  Contact
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  className="form-control form-control-sm rounded-3"
                  // placeholder="1234567890"
                  onChange={handleChange}
                />
              </div>
            </div>


            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="form-label small fw-semibold text-secondary text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                  Gender
                </label>
                <select
                  name="gender"
                  className="form-select form-select-sm rounded-3"
                  onChange={handleChange}
                  defaultValue=""
                >
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold text-secondary text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="DOB"
                  className="form-control form-control-sm rounded-3"
                  onChange={handleChange}
                />
              </div>
            </div>


            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                Profile Photo
              </label>
              <div
                className="border rounded-3 p-2 text-center bg-light d-flex align-items-center justify-content-center gap-2"
                style={{ borderStyle: "dashed", borderColor: "#9FE1CB", cursor: "pointer", height: "44px" }}
                onClick={() => fileRef.current.click()}
              >
                <span style={{ fontSize: "16px" }}>📷</span>
                <span className="small fw-semibold" style={{ color: "#0F6E56", fontSize: "12px" }}>
                  {fileName ? fileName : "Click to upload photo"}
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                name="myFile"
                accept="image/*"
                className="d-none"
                onChange={handleChange}
              />
            </div>


            <button
              type="submit"
              className="btn w-100 fw-semibold rounded-3 py-2 text-white"
              style={{
                background: "linear-gradient(135deg, #1D9E75, #0F6E56)",
                border: "none",
                fontSize: "14px",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-muted small mt-3 mb-0">
              Already have an account?{" "}
              <Link to="/" className="fw-semibold text-decoration-none" style={{ color: "#0F6E56" }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
