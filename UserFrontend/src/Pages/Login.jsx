// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API = import.meta.env.VITE_BASE_URL;

// export default function UserLogin() {

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {

//     e.preventDefault();
//     setMessage("");

//     try {

//       const response = await fetch(`${API}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           email,
//           password
//         })
//       });

//       const result = await response.json();
//       console.log(result);

//       if (result.success) {

//         const token = result.data.token;

//         localStorage.setItem("token", token);

//         navigate("/home");

//       } else {
//         setMessage(result.message);
//       }

//     } catch (error) {
//       setMessage("Server error");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "120px" }}>

//       <h2>User Login</h2>

//       <form onSubmit={handleLogin}>

//         <input
//           type="email"
//           placeholder="Enter email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <br /><br />

//         <div>
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             style={{ marginLeft: "10px" }}
//           >
//             {showPassword ? "Hide" : "Show"}
//           </button>

//         </div>

//         <br /><br />

//         <button type="submit">
//           Login
//         </button>

//       </form>

//       {message && (
//         <p style={{ color: "red" }}>
//           {message}
//         </p>
//       )}

//     </div>
//   );
// }

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { jwtDecode } from "jwt-decode";
import "./AuthPages.css";

const loginArt = "/artvista-auth/login-art.png";

const API = import.meta.env.VITE_BASE_URL;

export default function UserLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {

    e.preventDefault();
    setMessage("");

    try {

      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const result = await response.json();

      if (result.success) {

        const token = result.data.token;
        const userId = result.data.userId;

        login(token, userId);  
        
        const decoded = jwtDecode(token);
        if (decoded.role === "ADMIN") {
          localStorage.setItem("adminName", result.data.name || "Admin");
          localStorage.setItem("adminEmail", result.data.email || "");
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }

      } else {
        setMessage(result.message);
      }

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="artvista-page auth-page">
      <section className="auth-art">
        <img src={loginArt} alt="Colorful gallery artwork" />
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h1>Sign in to</h1>
          <h2>ArtVista</h2>

          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              <span>Email or username</span>
              <input
                type="email"
                placeholder="Enter email or user name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              <span>Password</span>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <a className="forgot-link" href="#forgot-password">
              Forgot password?
            </a>

            <button className="primary-action indigo auth-submit" type="submit">
              Login
            </button>
          </form>

          {message && <p className="form-message">{message}</p>}

          <div className="social-block">
            <span>or continue with</span>
            <div className="social-actions" aria-label="Social login examples">
              <button type="button" className="facebook">f</button>
              <button type="button" className="apple">Apple</button>
              <button type="button" className="google">G</button>
            </div>
          </div>

          <p className="switch-auth">
            If you don't have an account register
            <br />
            You can <Link to="/signup">Register here !</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
