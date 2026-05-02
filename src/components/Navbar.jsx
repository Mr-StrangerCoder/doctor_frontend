import { useDispatch, useSelector } from "react-redux";
import { logout } from "../authRedux/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getRoleBadge = (role) => {
    const config = {
      admin: { label: "Admin", bg: "#dc3545" },
      doctor: { label: "Doctor", bg: "#0F6E56" },
      user: { label: "User", bg: "#6c757d" },
    };
    return config[role] || config.user;
  };

  const badge = getRoleBadge(user?.role);

  return (
    <nav
      className="navbar navbar-expand px-3 px-md-4 d-flex align-items-center justify-content-between"
      style={{
        height: "64px",
        background: "#ffffff",
        borderBottom: "1px solid #e9ecef",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}
    >
  
      <div className="d-flex align-items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="btn btn-sm border-0 d-flex align-items-center justify-content-center"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: sidebarOpen ? "#f0faf6" : "#f8f9fa",
            color: "#0F6E56",
            transition: "all 0.2s",
          }}
          title="Toggle Sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

  
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "34px",
              height: "34px",
              background: "linear-gradient(135deg, #1D9E75, #0F6E56)",
              fontSize: "16px",
              flexShrink: 0,
            }}
          >
            🌿
          </div>
          <span
            className="fw-bold d-none d-sm-block"
            style={{ color: "#04342C", fontSize: "16px", letterSpacing: "-0.3px" }}
          >
            MediCare
          </span>
        </div>
      </div>

  
      <div className="d-flex align-items-center gap-2 gap-md-3">
    
        <span
          className="badge d-none d-sm-inline-flex"
          style={{
            background: badge.bg,
            fontSize: "11px",
            padding: "5px 10px",
            borderRadius: "20px",
            fontWeight: 600,
            letterSpacing: "0.03em",
          }}
        >
          {badge.label}
        </span>

    
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #1D9E75, #0F6E56)",
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span
            className="fw-semibold d-none d-md-block"
            style={{ color: "#212529", fontSize: "14px" }}
          >
            {user?.name || "User"}
          </span>
        </div>

      
        <button
          onClick={handleLogout}
          className="btn btn-sm d-flex align-items-center gap-1 fw-semibold"
          style={{
            background: "linear-gradient(135deg, #1D9E75, #0F6E56)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            padding: "7px 14px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="d-none d-sm-inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
