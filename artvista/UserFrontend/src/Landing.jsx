import React from 'react'
import {Link} from "react-router-dom";
const Landing = () => {
  return (
     <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h1>Welcome to ArtVista</h1>

      <div style={{ marginTop: "40px" }}>
        
        <Link to="/login">
          <button style={{ padding: "10px 25px", marginRight: "20px" }}>
            Login
          </button>
        </Link>

        <Link to="/signup">
          <button style={{ padding: "10px 25px" }}>
            Sign Up
          </button>
        </Link>

      </div>
    </div>
  )
}

export default Landing