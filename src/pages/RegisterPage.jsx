import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../authRedux/authSlice";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    if (e.target.name === "myFile") {
      setForm({ ...form, myFile: e.target.files[0] });
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
    if (form.myFile) {
      formData.append("myFile", form.myFile);
    }

    const res = await dispatch(registerUser(formData));

    // FIX: check using Redux Toolkit's matcher, not res.success
    if (registerUser.fulfilled.match(res)) {
      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    }
    // If rejected, error shows via Redux state automatically
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow p-4">
            <h3 className="text-center mb-4">Register</h3>

            {error && <Alert variant="danger">{error}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contactNumber"
                  placeholder="Enter contact number"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type="date" name="DOB" onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Profile Image</Form.Label>
                <Form.Control
                  type="file"
                  name="myFile"
                  accept="image/*"
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" /> Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>

              <div className="text-center mt-3">
                <Link to="/">Already have an account? Login</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
