import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const role = authUser?.role || "user";
  const fileRef = useRef();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [fileName, setFileName] = useState("");

  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    gender: "",
    DOB: "",
    myFile: null,
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("user/getUserInfo");
        const data = res.data?.user || null;
        console.log("Setting profile:", data); // add this
        setProfile(data);
        setForm({
          name: data?.name || "",
          contactNumber: data?.contactNumber || "",
          gender: data?.gender || "",
          DOB: data?.DOB ? data.DOB.split("T")[0] : "",
          myFile: null,
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("contactNumber", form.contactNumber);
      formData.append("gender", form.gender);
      formData.append("DOB", form.DOB);
      if (form.myFile) formData.append("myFile", form.myFile);

      const res = await axiosInstance.patch(
        `user/updateUser/${authUser._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updated = res.data?.user || null;
      setProfile(updated);
      setEditMode(false);
      setFileName("");
      showToast("Profile updated successfully!");
    } catch (err) {
      showToast(err.response?.data?.msg || "Failed to update profile", "danger");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: "#0F6E56" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
  
      {toast.msg && (
        <div className={`alert alert-${toast.type} py-2 small fw-semibold position-fixed`}
          style={{ top: "80px", right: "16px", zIndex: 9999, minWidth: "260px" }}>
          {toast.msg}
        </div>
      )}

    
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0" style={{ color: "#0F6E56" }}>👤 My Profile</h5>
          <small className="text-muted">Your personal information</small>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="btn btn-sm fw-semibold rounded-3"
          style={editMode
            ? { background: "#f0f0f0", border: "none", fontSize: "13px" }
            : { background: "linear-gradient(135deg, #1D9E75, #0F6E56)", border: "none", fontSize: "13px", color: "#fff" }
          }
        >
          {editMode ? "✕ Cancel" : "✏️ Edit Profile"}
        </button>
      </div>

      <div className="row g-4">

        {/* Profile Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 text-center">
            <div className="card-body p-4">
              {profile?.img_path ? (
                <img
                  src={profile.img_path}
                  alt="profile"
                  className="rounded-circle mb-3"
                  style={{ width: "90px", height: "90px", objectFit: "cover", border: "3px solid #1D9E75" }}
                  onError={(e) => { e.target.style.display = "none" }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-3"
                  style={{ width: "90px", height: "90px", background: "linear-gradient(135deg, #1D9E75, #04342C)", fontSize: "32px" }}
                >
                  {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <h6 className="fw-bold mb-1">
                {role === "doctor" ? "Dr. " : ""}{profile?.name || "—"}
              </h6>
              <p className="text-muted small mb-2">{profile?.email || "—"}</p>
              <span className={`badge ${role === "admin" ? "bg-danger" : role === "doctor" ? "bg-success" : "bg-primary"}`}>
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Details / Edit Form */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

              {!editMode ? (
            
                <>
                  <h6 className="fw-bold mb-3" style={{ color: "#0F6E56" }}>Personal Details</h6>
                  {[
                    ["Full Name", profile?.name || "—"],
                    ["Email", profile?.email || "—"],
                    ["Contact Number", profile?.contactNumber || "—"],
                    ["Gender", profile?.gender || "—"],
                    ["Date of Birth", profile?.DOB ? new Date(profile.DOB).toLocaleDateString() : "—"],
                    ["Age", profile?.age > 0 ? `${profile.age} years` : "—"],
                    ["Role", profile?.role || "—"],
                  ].map(([k, v], i, arr) => (
                    <div key={i} className={`d-flex justify-content-between py-2 ${i < arr.length - 1 ? "border-bottom" : ""}`} style={{ fontSize: "13px" }}>
                      <span className="text-muted">{k}</span>
                      <span className="fw-semibold" style={{ color: "#0F6E56" }}>{v}</span>
                    </div>
                  ))}
                </>
              ) : (
    
                <>
                  <h6 className="fw-bold mb-3" style={{ color: "#0F6E56" }}>Edit Profile</h6>
                  <form onSubmit={handleSubmit}>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px" }}>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control form-control-sm rounded-3"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px" }}>Contact Number</label>
                        <input
                          type="text"
                          name="contactNumber"
                          className="form-control form-control-sm rounded-3"
                          placeholder="e.g. 9876543210"
                          value={form.contactNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px" }}>Gender</label>
                        <select
                          name="gender"
                          className="form-select form-select-sm rounded-3"
                          value={form.gender}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px" }}>Date of Birth</label>
                        <input
                          type="date"
                          name="DOB"
                          className="form-control form-control-sm rounded-3"
                          value={form.DOB}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-secondary text-uppercase" style={{ fontSize: "11px" }}>Profile Photo</label>
                      <div
                        className="border rounded-3 p-2 text-center bg-light d-flex align-items-center justify-content-center gap-2"
                        style={{ borderStyle: "dashed", borderColor: "#9FE1CB", cursor: "pointer", height: "44px" }}
                        onClick={() => fileRef.current.click()}
                      >
                        <span>📷</span>
                        <span className="small fw-semibold" style={{ color: "#0F6E56", fontSize: "12px" }}>
                          {fileName ? fileName : "Click to upload new photo"}
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
                      className="btn fw-semibold rounded-3 py-2 text-white px-5"
                      style={{ background: "linear-gradient(135deg, #1D9E75, #0F6E56)", border: "none", fontSize: "13px" }}
                      disabled={saving}
                    >
                      {saving
                        ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Saving...</>
                        : "Save Changes"
                      }
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
