import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthProvider";

import "./App.css";

import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import PaintingDetails from "./Pages/PaintingDetails";
import Paintings from "./Pages/Paintings";
import About from "./Pages/About";
import Contact from "./Pages/Contact";

import MainLayout from "./Layouts/MainLayout";
import Cart from "./Pages/Cart";
import Events from "./Pages/Events";
import EventDetails from "./Pages/EventDetails";
import Checkout from "./Pages/Checkout";

// Admin Imports
import Dashboard from "./Admin/Pages/Dashboard";
import ManageEvents from "./Admin/Pages/ManageEvents";
import ManagePaintings from "./Admin/Pages/ManagePaintings";
import ManageUsers from "./Admin/Pages/ManageUsers";
import AdminWrapper from "./Admin/Components/AdminWrapper";
import ManageArtist from "./Admin/Pages/ManageArtist";
import ManageOrders from "./Admin/Pages/ManageOrders";

const ProtectedAdminRoute = ({ children }) => {
  const { token, role } = useContext(AuthContext);
  if (!token || role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* User Routes */}
        <Route element={<MainLayout />}>

          <Route path="/home" element={<Home />} />

          <Route path="/paintings" element={<Paintings />} />

          <Route path="/paintingDetails/:id" element={<PaintingDetails />} />

          <Route path="/events" element={<Events />}></Route>
          <Route path="/events/:id" element={<EventDetails />} />


          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />


        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <Dashboard />
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <ManageOrders />
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <ManageEvents />
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/paintings"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <ManagePaintings />
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <ManageUsers />
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/artists"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <ManageArtist />
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;