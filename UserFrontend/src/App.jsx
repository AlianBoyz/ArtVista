import { useState, useContext, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthProvider";
import { CircularProgress, Box } from "@mui/material";

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
import Orders from "./Pages/Orders";

// Admin Imports — lazy loaded (only downloaded when admin route is visited)
import AdminWrapper from "./Admin/Components/AdminWrapper";
const Dashboard      = lazy(() => import("./Admin/Pages/Dashboard"));
const ManageEvents   = lazy(() => import("./Admin/Pages/ManageEvents"));
const ManagePaintings = lazy(() => import("./Admin/Pages/ManagePaintings"));
const ManageUsers    = lazy(() => import("./Admin/Pages/ManageUsers"));
const ManageArtist   = lazy(() => import("./Admin/Pages/ManageArtist"));
const ManageOrders   = lazy(() => import("./Admin/Pages/ManageOrders"));

// Shared loading fallback for all lazy admin pages
const AdminLoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
    }}
  >
    <CircularProgress sx={{ color: "#675ed9" }} size={48} thickness={4} />
  </Box>
);

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
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Routes — all wrapped in Suspense for lazy loading */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <Dashboard />
                </Suspense>
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <ManageOrders />
                </Suspense>
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <ManageEvents />
                </Suspense>
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/paintings"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <ManagePaintings />
                </Suspense>
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <ManageUsers />
                </Suspense>
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/artists"
          element={
            <ProtectedAdminRoute>
              <AdminWrapper>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <ManageArtist />
                </Suspense>
              </AdminWrapper>
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback routes */}
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
