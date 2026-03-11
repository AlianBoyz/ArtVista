import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ManageEvents from "./Pages/ManageEvents";
import ManagePaintings from "./Pages/ManagePaintings";
import ManageUsers from "./Pages/ManageUsers";

import AdminWrapper from "./Components/AdminWrapper";
import ManageArtist from './Pages/ManageArtist'
import ManageOrders from './Pages/ManageOrders'

const appBackground =
  "C:\\Users\\Niladri1\\Desktop\\pngtree-vibrant-and-colorful-texture-abstract-art-background-capturing-hand-drawn-acrylic-image_13720920.png";

function App() {
  return (
    <div
      className="app-shell"
      style={{ "--app-background": `url(${appBackground})` }}
    >
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
    </div>
  )
}

export default App
