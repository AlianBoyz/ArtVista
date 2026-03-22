import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import PaintingDetails from "./Pages/PaintingDetails";
import Paintings from "./Pages/Paintings";

import MainLayout from "./Layouts/MainLayout";
import Cart from "./Pages/Cart";
import Events from "./Pages/Events";
import Checkout from "./Pages/Checkout";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login></Login>}
        />

        <Route path="/signup" element={<Signup></Signup>} />

        <Route element={<MainLayout />}>

          <Route path="/home" element={<Home />} />

          <Route path="/paintings" element={<Paintings />} />

          <Route path="/paintingDetails/:id" element={<PaintingDetails />} />

          <Route path="/events" element={<Events></Events>}></Route>


          <Route path="/cart" element={<Cart></Cart>}></Route>
          <Route path="/checkout" element={<Checkout></Checkout>}></Route>


        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;