import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { jwtDecode } from "jwt-decode";
import "./AuthPages.css";

const signupArt = "/artvista-auth/landing-sky.jpeg";

const url = import.meta.env.VITE_BASE_URL;

const Signup = () => {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("USER");
  const [passkey, setPasskey] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      phone,
      role,
      passkey
    };

    try {

      const response = await fetch(`${url}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {

        const token = data.data.token;
        const userId = data.data.userId;

        login(token, userId);

        const decoded = jwtDecode(token);
        if (decoded.role === "ADMIN") {
          localStorage.setItem("adminName", data.data.name || "Admin");
          localStorage.setItem("adminEmail", data.data.email || "");
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="artvista-page auth-page signup-page">
      <section className="auth-art">
        <img src={signupArt} alt="Soft painted sky artwork" />
      </section>

      <section className="auth-panel">
        <div className="auth-card compact">
          <h1>Sign Up to</h1>
          <h2>ArtVista</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Name</span>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              <span>Email ID</span>
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              <span>Phone</span>
              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>

            <label>
              <span>Register as</span>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  marginBottom: '15px',
                  background: '#f9f9f9'
                }}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>

            {role === "ADMIN" && (
              <label>
                <span>Admin Passkey</span>
                <input
                  type="password"
                  placeholder="Enter secret passkey"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  required
                />
              </label>
            )}

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

            <button className="primary-action indigo auth-submit" type="submit">
              Register
            </button>
          </form>

          <div className="social-block">
            <span>or continue with</span>
            <div className="social-actions" aria-label="Social signup examples">
              <button type="button" className="facebook">f</button>
              <button type="button" className="apple">Apple</button>
              <button type="button" className="google">G</button>
            </div>
          </div>

          <p className="switch-auth">
            If you already have an account
            <br />
            You can <Link to="/login">Login here !</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Signup;
