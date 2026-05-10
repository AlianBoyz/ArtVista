import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router-dom'
const MainLayout = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Navbar />
       <div style={{ paddingTop: "70px" }}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout

