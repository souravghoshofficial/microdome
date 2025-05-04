import React from 'react'

import { Link } from 'react-router'

import {RiArrowDropRightLine} from "@remixicon/react"

import { CourseCard } from '../components'

const courseDetails ={
    id: 2,
    courseTitle: "B.Sc Hons. Microbiology",
    subTitle: "Ultimate guide to excel in the Microbiology",
    courseTag: "B.Sc Hons.",
    type: "live",
    language: "hinglish",
    courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
    actualPrice: 3600,
    discountedPrice: 3000,
    linkAddress: "bsc-hons-batch"
  }

const BScHonsBatch = () => {
  return (
    <div className='w-full flex items-center justify-center'>
    <div className='mt-8 w-full lg:w-[90%]  relative flex flex-col lg:flex-row justify-center lg:gap-10 lg:px-12 lg:py-6 mb-16'>
        <div className='w-[100vw] h-[108%] lg:h-96 absolute bg-slate-200/50 dark:bg-gray-800 z-10'></div>
        <div className='w-[90%] mx-auto lg:w-[60%] z-20 mt-16'>
            <div className='flex items-center gap-2 text-sm font-normal text-gray-600 dark:text-gray-300'>
                <Link to="/">Home</Link> 
                <RiArrowDropRightLine size={30} fontWeight={100} color='gray' />
                <Link to="/courses">Courses</Link> 
                <RiArrowDropRightLine size={30} fontWeight={100} color='gray' />
                <Link to="#">B.Sc Hons. Batch</Link> 
            </div>
            <h3 className='mt-2 leading-10 text-2xl md:text-3xl font-bold'>B.Sc Honours Microbiology</h3>
            <h5 className='mt-2 w-[95%] text-[17px]'>The most updated comprehensive course covering from basics to advanced concepts in Microbiology. Perfect for students and aspirants aiming to excel in B.Sc. Microbiology exams and build a strong academic foundation.</h5>
        </div>
        <div className='mt-16 lg:sticky h-fit top-32 w-[90%] mx-auto lg:w-[28%] z-20'>
            <CourseCard courseTitle={courseDetails.courseTitle} subTitle={courseDetails.subTitle} courseImg={courseDetails.courseImg} courseTag={courseDetails.courseTag.toUpperCase()} actualPrice={courseDetails.actualPrice} discountedPrice={courseDetails.discountedPrice} type={courseDetails.type.toUpperCase()} language={courseDetails.language.toUpperCase()} btnText='Buy Now' />
        </div>
    </div>
</div>
  )
}

export default BScHonsBatch