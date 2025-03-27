import React from 'react'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";

import { Navbar , Footer } from './components'
import { Landing , About , Contact , Enroll , Testimonial, Signup } from './pages'

const Layout = () => {
  return (
    <div className='w-full relative'>
      <Navbar />
      <Landing />
      <About />
      <Enroll />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  )
}

export default Layout