import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../authRedux/authSlice";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticate } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticate) {
      navigate("/dashboard");
    }
  }, [isAuthenticate, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(res)) {
      navigate("/dashboard");
    } else if (res.payload?.msg === "User not found") {
      navigate("/register");
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
        style={{ width: "780px", height: "420px" }}
      >
      
        <div
          className="d-flex flex-column justify-content-center align-items-start p-5 text-white"
          style={{
            width: "42%",
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
            Welcome Back!
          </h2>
          <p
            className="opacity-75 mb-4"
            style={{ fontSize: "13px", lineHeight: "1.6" }}
          >
            Sign in to your account and pick up right where you left off.
          </p>
          <hr className="w-100 opacity-25" />
          <p className="opacity-50 mt-3 mb-1" style={{ fontSize: "12px" }}>
            ✅ &nbsp;Secure login
          </p>
          <p className="opacity-50 mb-1" style={{ fontSize: "12px" }}>
            ✅ &nbsp;Your data is safe
          </p>
          <p className="opacity-50 mb-0" style={{ fontSize: "12px" }}>
            ✅ &nbsp;Access your dashboard
          </p>
        </div>

      
        <div
          className="d-flex flex-column justify-content-center p-5"
          style={{ width: "58%" }}
        >
          <h5 className="fw-bold mb-1 text-dark">Sign In</h5>
          <p className="text-muted mb-4" style={{ fontSize: "13px" }}>
            Enter your credentials to continue
          </p>

          {error && (
            <div className="alert alert-danger py-2 small fw-medium" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                className="form-label fw-semibold text-secondary text-uppercase mb-1"
                style={{ fontSize: "11px", letterSpacing: "0.05em" }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control form-control-sm rounded-3"
                placeholder=""
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="form-label fw-semibold text-secondary text-uppercase mb-1"
                style={{ fontSize: "11px", letterSpacing: "0.05em" }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control form-control-sm rounded-3"
                // placeholder="Enter your password"
                onChange={handleChange}
                required
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
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-muted small mt-3 mb-0">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="fw-semibold text-decoration-none"
                style={{ color: "#0F6E56" }}
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
