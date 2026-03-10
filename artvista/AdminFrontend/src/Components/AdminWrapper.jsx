import React, { useState } from "react";
import Sidebar from "./Sidebar";

const AdminWrapper = ({ children }) => {

  const [open, setOpen] = useState(true);

  return (
    <div style={{ display: "flex" }}>

      {/* Main Page */}
      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>

      {/* Sidebar */}
      {open && <Sidebar />}

      {/* Collapse Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          right: open ? "220px" : "0px",
          top: "20px"
        }}
      >
        {open ? "Close" : "Open"}
      </button>

    </div>
  );
};

export default AdminWrapper;