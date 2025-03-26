import React from 'react'
import './index.css'

import { Navbar , Footer } from './components'
import { Landing , About , Contact , Enroll , Testimonial } from './pages'

const App = () => {
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

export default App