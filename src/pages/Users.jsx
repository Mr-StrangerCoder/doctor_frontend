import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("user/getAllUsers");
        setUsers(res.data?.users || []);
      } catch (err) {
        console.error("Users fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0" style={{ color: "#0F6E56" }}>👥 All Users</h5>
          <small className="text-muted">{users.length} registered users</small>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              {["#", "Photo", "Name", "Email", "Role", "Contact", "Gender", "DOB", "Age"].map(h => (
                <th key={h} className="text-uppercase text-muted fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((u, i) => (
              <tr key={u._id}>
                <td className="small text-muted align-middle">{i + 1}</td>
                <td className="align-middle">
                  {u.img_path ? (
                    <img
                      src={u.img_path}
                      alt=""
                      className="rounded-circle"
                      style={{ width: "32px", height: "32px", objectFit: "cover" }}
                      onError={(e) => { e.target.style.display = "none" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #1D9E75, #04342C)", fontSize: "12px" }}
                    >
                      {u.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </td>
                <td className="small fw-semibold align-middle">{u.name || "—"}</td>
                <td className="small text-muted align-middle">{u.email || "—"}</td>
                <td className="align-middle">
                  <span className={`badge ${u.role === "admin" ? "bg-danger" : u.role === "doctor" ? "bg-success" : "bg-primary"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="small text-muted align-middle">{u.contactNumber || "—"}</td>
                <td className="small text-muted align-middle">{u.gender || "—"}</td>
                <td className="small text-muted align-middle">
                  {u.DOB ? new Date(u.DOB).toLocaleDateString() : "—"}
                </td>
                <td className="small text-muted align-middle">
                  {u.age > 0 ? `${u.age} yrs` : "—"}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={9} className="text-center text-muted py-5 small">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
