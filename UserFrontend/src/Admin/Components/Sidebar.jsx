import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider";
import "./Sidebar.css";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </svg>
    ),
  },
  {
    label: "Manage Event",
    to: "/admin/events",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </svg>
    ),
  },
  {
    label: "Manage Paintings",
    to: "/admin/paintings",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="m21 16-5.5-5.5L7 19" />
      </svg>
    ),
  },
  {
    label: "Manage User",
    to: "/admin/users",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
      </svg>
    ),
  },
  {
    label: "Manage Artist",
    to: "/admin/artists",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
      </svg>
    ),
  },
  {
    label: "Manage Order",
    to: "/admin/orders",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="19" r="1.5" />
        <circle cx="17" cy="19" r="1.5" />
        <path d="M3 5h2l2.6 9.5a1 1 0 0 0 1 .75h8.9a1 1 0 0 0 1-.76L21 8H7" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const adminName = localStorage.getItem("adminName") || "Admin";
  const adminEmail = localStorage.getItem("adminEmail") || "";
  const avatarLetter = adminEmail.trim().charAt(0).toUpperCase() || "A";

  const handleAdminLogout = () => {
    if (logout) logout();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__profile">
        <div className="admin-sidebar__avatar">{avatarLetter}</div>
        <div>
          <p className="admin-sidebar__label">Admin Profile</p>
          <h2>{adminName}</h2>
          {adminEmail && <span className="admin-sidebar__meta">{adminEmail}</span>}
        </div>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `admin-sidebar__link${isActive ? " is-active" : ""}`
            }
          >
            <span className="admin-sidebar__icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <button
          onClick={handleAdminLogout}
          className="admin-sidebar__link"
          style={{
            marginTop: 12,
            border: "none",
            background: "#fee2e2",
            color: "#991b1b",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          <span className="admin-sidebar__icon">
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ stroke: "#991b1b" }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
