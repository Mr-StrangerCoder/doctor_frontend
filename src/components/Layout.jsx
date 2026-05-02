import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Asidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f5f7fa" }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
