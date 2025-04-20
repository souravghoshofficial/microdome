import React from 'react'
import './index.css'
import { Outlet } from "react-router";
import { Navbar , Footer } from './components';

const Layout = () => {
  return (
    <div className='w-full relative bg-white dark:bg-gray-950 text-black dark:text-white transition-colors duration-300 '>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout