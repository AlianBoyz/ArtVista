import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#eee",
        padding: "15px"
      }}
    >

      <h3>Admin</h3>

      <Link to="/admin/dashboard">Dashboard</Link>
      <br /><br />

      <Link to="/admin/events">Manage Event</Link>
      <br /><br />

      <Link to="/admin/paintings">Manage Paintings</Link>
      <br /><br />

      <Link to="/admin/users">Manage User</Link>
      <br /><br />

      <Link to="/admin/artists">Manage Artist</Link>
      <br /><br />

      <Link to="/admin/orders">Manage Order</Link>

    </div>
  );
};

export default Sidebar;