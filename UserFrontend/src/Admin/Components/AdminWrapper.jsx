import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminWrapper.css";

const AdminWrapper = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    localStorage.removeItem("userId");
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <header className="admin-shell__header">
        <div
          className="admin-brand"
          onClick={() => setOpen(!open)}
          style={{ cursor: "pointer", userSelect: "none" }}
          title={open ? "Click to hide menu" : "Click to show menu"}
        >
          <div className="admin-brand__avatar">A</div>
          <span>ArtVista</span>
        </div>

        <div className="admin-shell__title">ADMIN IN</div>
      </header>

      <main className={`admin-shell__body${open ? "" : " is-sidebar-hidden"}`}>
        <div className={`admin-shell__sidebarSlot${open ? "" : " is-hidden"}`}>
          <Sidebar />
        </div>
        <div className="admin-shell__content">{children}</div>
      </main>
    </div>
  );
};

export default AdminWrapper;
