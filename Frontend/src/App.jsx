import React from 'react'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from './Layout.jsx'
import { Signup , Login } from './pages'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App