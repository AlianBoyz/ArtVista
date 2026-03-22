// import { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../Context/AuthProvider";

// function Navbar() {

//   const navigate = useNavigate();
//   const{token, logout}= useContext(AuthContext);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <nav style={styles.navbar}>
      
//       <h2 style={styles.logo}>ArtVista</h2>

//       <ul style={styles.navLinks}>
        // <li><Link to="/home">Home</Link></li>
        // <li><Link to="/events">Events</Link></li>
        // <li><Link to="/shop">Shop</Link></li>
        // <li><Link to="/about">About</Link></li>
        // <li><Link to="/contact">Contact</Link></li>
        // <li><Link to="/cart">Cart</Link></li>


//         {token && (
//           <li>
//             <button onClick={handleLogout} style={styles.logoutBtn}>
//               Logout
//             </button>
//           </li>
//         )}

//       </ul>

//     </nav>
//   );
// }

// const styles = {
//   navbar: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "15px 40px",
//     backgroundColor: "#222",
//     color: "white",
//     zIndex: 1000
//   },

//   logo: {
//     margin: 0
//   },

//   navLinks: {
//     listStyle: "none",
//     display: "flex",
//     gap: "25px",
//     alignItems: "center"
//   },

//   logoutBtn: {
//     padding: "6px 12px",
//     cursor: "pointer"
//   }
// };

// export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

function Navbar() {

  const navigate = useNavigate();

  const { token, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (

    <nav style={styles.navbar}>

      <h2 style={styles.logo}>ArtVista</h2>

      <ul style={styles.navLinks}>

        <li><Link to="/home">Home</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/cart">Cart</Link></li>

        {token && (
          <li>
            <button onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}

      </ul>

    </nav>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "#222",
    color: "white",
    zIndex: 1000
  },

  logo: {
    margin: 0
  },

  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "25px",
    alignItems: "center"
  },

  logoutBtn: {
    padding: "6px 12px",
    cursor: "pointer"
  }
};

export default Navbar;