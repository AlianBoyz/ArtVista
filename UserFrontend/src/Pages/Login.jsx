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
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

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

        login(token);  
        localStorage.setItem("userId", userId);
 
        navigate("/home");

      } else {
        setMessage(result.message);
      }

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (

    <div style={{ textAlign: "center", marginTop: "120px" }}>

      <h2>User Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
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
        <p style={{ color: "red" }}>
          {message}
        </p>
      )}

    </div>
  );
}