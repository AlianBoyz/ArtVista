// import { set } from 'mongoose';
// import React, { createContext, useState } from 'react'

// export const AuthContext= createContext();
// export const AuthProvider = ({children}) => {
//     const [token, setToken]= useState(localStorage.getItem("token"));
//     const login=(newToken)=>{
//         localStorage.setItem("token", newToken);
//         setToken(newToken);
//     };
//     const logout=()=>{
//         localStorage.removeItem("token");
//         setToken(null);
//     }
//   return (
//     <AuthContext.Provider value={{token, login, logout}}>
//         {children}
//     </AuthContext.Provider>
//   )
// }


import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken) {
      setToken(storedToken);
      setUserId(storedUserId);
      try {
        const decoded = jwtDecode(storedToken);
        setRole(decoded.role);
      } catch (e) {
        console.error("Invalid token");
      }
    }
  }, []);

  const login = (newToken, newUserId) => {
    localStorage.setItem("token", newToken);
    if (newUserId) {
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    }
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      setRole(decoded.role);
    } catch (e) {
      console.error("Invalid token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};