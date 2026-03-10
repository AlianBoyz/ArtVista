import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ManageEvents from "./Pages/ManageEvents";
import ManagePaintings from "./Pages/ManagePaintings";
import ManageUsers from "./Pages/ManageUsers";

import AdminWrapper from "./Components/AdminWrapper";
import ManageArtist from './Pages/ManageArtist'
import ManageOrders from './Pages/ManageOrders'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminWrapper>
              <Dashboard />
            </AdminWrapper>
          }
        />
        
          <Route
          path="/admin/orders"
          element={
            <AdminWrapper>
              <ManageOrders />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/events"
          element={
            <AdminWrapper>
              <ManageEvents />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/paintings"
          element={
            <AdminWrapper>
              <ManagePaintings />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminWrapper>
              <ManageUsers />
            </AdminWrapper>
          }
        />
        <Route
          path="/admin/artists"
          element={
            <AdminWrapper>
              <ManageArtist/>
            </AdminWrapper>
          }
        />


      </Routes>
    
    </BrowserRouter>
  )
}

export default App
