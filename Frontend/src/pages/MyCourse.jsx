import React from 'react'

import { RiStarFill , RiStarHalfFill } from "@remixicon/react"
import CourseCard from '../components/CourseCard'

const IITJAM = () => {
  return (
    <div className='w-full h-screen relative'>
      <div className='w-[25vw] h-[80vh] absolute top-[12%] right-[12%] flex items-center justify-center'>
        <CourseCard courseImg={"https://i.pinimg.com/736x/6a/3e/55/6a3e559df3b2ab60acf2c0a8eca63dba.jpg"} courseTitle={"IIT JAM Microbiology"} actualPrice={4200} discountedPrice={3600} btnText='Buy Now' linkAddress='/'/>
      </div>
        <div className='w-full h-[55vh] bg-gray-900 py-16'>
            <div className='w-[90%] mx-auto px-8 py-4'>
                  <h2 className='mt-8 text-2xl md:text-3xl font-bold'>IIT JAM Microbiology</h2>
                  <p className='w-[50%] mt-4 text-wrap text-sm md:text-lg'>Prepare for the IIT JAM Microbiology exam with our comprehensive course designed for undergraduate students aspiring to pursue a Master's degree in Microbiology at IITs. Our expertly crafted curriculum covers all essential topics, including Cell Biology, Biochemistry, Genetics, Immunology, and Applied Microbiology, ensuring a strong conceptual foundation.</p>
                  <h4 className='mt-4'>
                    <span className='mr-2'>100+ Hours</span>|
                    <span className='mx-2'>English</span>|
                    <span className='mx-2'>4.5</span>
                    <RiStarFill size={15} className='inline-block mr-1' />
                    <RiStarFill size={15} className='inline-block mr-1' />
                    <RiStarFill size={15} className='inline-block mr-1' />
                    <RiStarFill size={15} className='inline-block mr-1' />
                    <RiStarHalfFill size={15} className='inline-block' />
                  </h4>
            </div>
        </div>
    </div>
  )
}

export default IITJAM