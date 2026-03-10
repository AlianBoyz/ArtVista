import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Landing from './Landing'
import Login from './Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing></Landing>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
