import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../authRedux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticate } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticate) {
      navigate("/dashboard");
    }
  }, [isAuthenticate, navigate]);

  // Clear errors when component unmounts
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
    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-4">Login</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          className="form-control mb-3"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="text-center mt-3">
        <Link to="/register">New user? Register</Link>
      </div>
    </div>
  );
};

export default LoginPage;
