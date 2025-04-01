import React from 'react'
import './index.css'
import { Outlet } from "react-router";

import { Navbar , Footer } from './components'
import { Landing , About , Contact , Enroll , Testimonial, Signup } from './pages'

const Layout = () => {
  return (
    <div className='w-full relative bg-white dark:bg-gray-950 text-black dark:text-white'>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout