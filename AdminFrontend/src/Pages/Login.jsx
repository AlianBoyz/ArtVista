import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(result.message);
        setError(false);
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("adminEmail", result.data.email || email);
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
    <div className="login-page">
      <section className="login-visual" aria-hidden="true">
        <div className="login-visual__overlay">
          <p className="login-visual__eyebrow">Curated Admin Access</p>
          <h1>ArtVista</h1>
          <p className="login-visual__text">
            Manage exhibitions, paintings, artists, and orders from one
            workspace.
          </p>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel__content">
          <div className="login-copy">
            <p className="login-copy__lead">Sign in to</p>
            <h2>ArtVista</h2>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label className="login-field">
              <span className="sr-only">Email</span>
              <input
                type="email"
                placeholder="Enter email or user name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="login-field login-field--password">
              <span className="sr-only">Password</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button
              className="login-password-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>

            <a className="login-forgot" href="/">
              Forgot password?
            </a>

            <button className="login-submit" type="submit">
              Login
            </button>
          </form>

          {message && (
            <p className={`login-message ${isError ? "is-error" : "is-success"}`}>
              {message}
            </p>
          )}

        </div>
      </section>
    </div>
  );
};

export default Login;
