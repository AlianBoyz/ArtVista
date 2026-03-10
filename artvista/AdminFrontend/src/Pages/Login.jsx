import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BASE_URL;

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(`${API}/admin/login`, {
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

        setMessage(result.message);
        setError(false);

        localStorage.setItem("token", result.data.token);

        navigate("/admin/dashboard");

      } else {

        setMessage(result.message || "Login Failed");
        setError(true);

      }

    } catch (error) {

      setMessage("Server Error. Please try again.");
      setError(true);

    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ marginLeft: "10px" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>

        </div>

        <br /><br />

        <button type="submit">
          Login
        </button>

      </form>

      {message && (
        <p style={{ color: isError ? "red" : "green", marginTop: "15px" }}>
          {message}
        </p>
      )}

    </div>
  );
};

export default Login;