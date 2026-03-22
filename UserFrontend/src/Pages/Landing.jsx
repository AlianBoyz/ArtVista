import React, { useEffect } from "react";
import { Link,useNavigate   } from "react-router-dom";

const Landing = () => {

  const navigate=useNavigate();
  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(token){
      navigate("/home");
    }
  },[])

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
          <button style={{ padding: "10px 25px", marginRight: "20px" }}>
            Sign Up
          </button>
        </Link>

        <Link to="/home">
          <button style={{ padding: "10px 25px" }}>
            Continue as Guest
          </button>
        </Link>

      </div>
    </div>
  );
};

export default Landing;