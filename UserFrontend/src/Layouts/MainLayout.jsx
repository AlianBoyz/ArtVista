import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router-dom'
const MainLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
       <div style={{ marginTop: "80px" }}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout

