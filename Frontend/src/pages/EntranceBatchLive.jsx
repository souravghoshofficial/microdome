import React from 'react'
import { Link } from 'react-router'

import {RiArrowDropRightLine} from "@remixicon/react"

import { BuyNowCard, CourseSyllabus } from "../components";

const courseDetails ={
    id: 1,
    courseTitle: "M.Sc Entrance Batch",
    subTitle: "Crack M.Sc Entrances — IIT JAM, CUET PG & More",
    courseTag: "M.Sc Entrance",
    type: "live",
    language: "hinglish",
    courseImg: "https://i.pinimg.com/736x/5a/81/fc/5a81fca747dbe4f7b10c8e1102a5db32.jpg",
    actualPrice: 4200,
    discountedPrice: 3600,
    linkAddress: "entrance-batch-live"
  }

const EntranceBatchLive = () => {
  return (
       <div className='w-full flex items-center justify-center'>
        <div className='mt-8 w-full lg:w-[90%] flex flex-col lg:flex-row justify-center lg:gap-10 lg:px-12 lg:py-6 mb-16'>
            <div className='w-[90%] mx-auto lg:w-[60%] z-20 mt-16'>
                <h3 className='mt-2 leading-10 text-2xl md:text-3xl font-bold'>M.Sc Entrance Examination Batch - Crack IIT JAM , CUET PG and More</h3>
                <h5 className='mt-2 w-[95%] text-[17px]'>The most updated comprehensive course covering from basics to advanced levels for M.Sc. entrances including IIT JAM, CUET PG, and more. Perfect for students and aspirants aiming to crack top exams and secure admission to leading institutes.</h5>
                <div className="w-full mt-4">
            <CourseSyllabus />
          </div>
            </div>
            <div className='mt-16 lg:sticky h-fit top-32 w-[90%] mx-auto lg:w-[30%] z-20'>
                 <BuyNowCard
            actualPrice={999}
            handlePayment={null}
            isEnrolled={false}
          />
            </div>
        </div>
    </div>
  )
}

export default EntranceBatchLive