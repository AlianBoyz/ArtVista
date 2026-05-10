import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";

const landscapeArt = "/artvista-auth/landing-sky.jpeg";
const colorPortrait = "/artvista-auth/color-portrait.png";
const desiArt = "/artvista-auth/desi-art.png";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="artvista-page landing-page">
      <header className="landing-nav">
        <Link className="brand" to="/">
          ArtVista
        </Link>
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/events">Event</Link>
          <Link to="/paintings">Shop</Link>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="landing-shell">
        <section className="art-collage" aria-label="ArtVista artwork preview">
          <img className="collage-wide" src={landscapeArt} alt="Painted sunset landscape" />
          <img src={desiArt} alt="Colorful illustrated art print" />
          <img src={colorPortrait} alt="Vivid contemporary painting" />
        </section>

        <section className="landing-copy">
          <div>
            <h1>
              Welcome to <span>ArtVista</span>
            </h1>
            <p>
              Discover expressive paintings, collect original work, and stay close to the
              artists and events shaping a brighter creative community.
            </p>
            <p>
              Browse curated collections, register for exhibitions, or sign in to manage
              your cart and orders.
            </p>
          </div>

          <div className="landing-actions">
            <Link className="primary-action pink" to="/login">
              Login
            </Link>
            <Link className="primary-action indigo" to="/signup">
              Register
            </Link>
            <Link className="ghost-action" to="/home">
              Continue as Guest
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
