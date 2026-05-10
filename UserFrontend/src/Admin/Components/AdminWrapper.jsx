import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./AdminWrapper.css";

const AdminWrapper = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="admin-shell">
      <header className="admin-shell__header">
        <div className="admin-brand">
          <div className="admin-brand__avatar">A</div>
          <span>ArtVista</span>
        </div>

        <div className="admin-shell__title">ADMIN IN</div>

        <button
          className="admin-shell__toggle"
          onClick={() => setOpen(!open)}
          type="button"
        >
          {open ? "Hide Menu" : "Show Menu"}
        </button>
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
