import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const menuConfig = {
  admin: [
    { label: "Dashboard",    path: "/dashboard",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { label: "Appointments", path: "/appointments", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: "Doctors",      path: "/doctors",      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { label: "Profile",      path: "/profile",      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ],
  doctor: [
    { label: "Dashboard",       path: "/dashboard",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { label: "My Appointments", path: "/appointments", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: "Profile",         path: "/profile",      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ],
  user: [
    { label: "Dashboard",        path: "/dashboard",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { label: "Book Appointment", path: "/appointments", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: "Doctors",          path: "/doctors",      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { label: "Apply as Doctor",  path: "/apply-doctor", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> },
    { label: "Profile",          path: "/profile",      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ],
};

const Sidebar = ({ isOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";
  const menuItems = menuConfig[role] || menuConfig.user;
  const sidebarWidth = "240px";

  return (
    <>
      {/* Overlay for mobile */}
      <div
        style={{ display: isOpen ? "block" : "none", position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 199 }}
        className="d-md-none"
      />

      {/* Sidebar */}
      <div style={{
        width: isOpen ? sidebarWidth : "0",
        minWidth: isOpen ? sidebarWidth : "0",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowX: "hidden",
        overflowY: "auto",
        background: "linear-gradient(180deg, #04342C 0%, #0a4a3a 60%, #0F6E56 100%)",
        transition: "width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 200,
        flexShrink: 0,
        boxShadow: isOpen ? "2px 0 16px rgba(0,0,0,0.18)" : "none",
      }}>
        <div style={{ width: sidebarWidth }}>

          {/* Logo */}
          <div className="d-flex align-items-center gap-2 px-4"
            style={{ height: "64px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.12)", fontSize: "15px", flexShrink: 0 }}>
              🌿
            </div>
            <span className="fw-bold text-white"
              style={{ fontSize: "15px", letterSpacing: "-0.2px", whiteSpace: "nowrap" }}>
              MediCare
            </span>
          </div>

          {/* Role Label */}
          <div className="px-4 pt-4 pb-2">
            <span className="text-uppercase fw-semibold"
              style={{ fontSize: "10px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
              {role} menu
            </span>
          </div>

          {/* Menu Items */}
          <ul className="list-unstyled px-3 mb-0">
            {menuItems.map((item) => (
              <li key={item.path} className="mb-1">
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "10px 14px", borderRadius: "10px", textDecoration: "none",
                    fontWeight: 500, fontSize: "14px", whiteSpace: "nowrap",
                    transition: "all 0.18s",
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.65)",
                    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                    borderLeft: isActive ? "3px solid #1D9E75" : "3px solid transparent",
                  })}
                >
                  <span style={{ flexShrink: 0, opacity: 0.9 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Bottom — User Info */}
          <div className="mx-3 mt-4 p-3 rounded-3"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                style={{ width: "34px", height: "34px", background: "rgba(29,158,117,0.5)", fontSize: "13px" }}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div className="text-white fw-semibold"
                  style={{ fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.name || "User"}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.email || ""}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;