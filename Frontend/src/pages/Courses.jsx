import React from 'react'
import { CourseCard } from '../components'

const Courses = () => {
  const courses = [
    {
      id: 1,
      courseTitle: "M.Sc Entrance Batch",
      subTitle: "Crack M.Sc Entrances — IIT JAM, CUET PG & More",
      courseTag: "M.Sc Entrance",
      type: "live",
      language: "hinglish",
      courseImg: "https://i.pinimg.com/736x/5a/81/fc/5a81fca747dbe4f7b10c8e1102a5db32.jpg",
      actualPrice: 1500,
      discountedPrice: 1200,
      linkAddress: "entrance-batch-live"
    },
    {
      id: 2,
      courseTitle: "M.Sc Entrance Batch",
      subTitle: "Ace IIT JAM, CUET PG & Beyond",
      courseTag: "M.Sc Entrance",
      type: "recorded",
      language: "hinglish",
      courseImg: "https://i.pinimg.com/736x/cf/e3/32/cfe332e963458f410c8cb6157a14e92e.jpg",
      actualPrice: 6000,
      discountedPrice: 4999,
      linkAddress: "entrance-batch-recorded"
    },
    {
      id: 3,
      courseTitle: "B.Sc Hons. Microbiology",
      subTitle: "Ultimate guide to excel in the Microbiology",
      courseTag: "B.Sc Hons.",
      type: "live",
      language: "hinglish",
      courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
      actualPrice: 1200,
      discountedPrice: 999,
      linkAddress: "bsc-hons-batch"
    },
  ]
  return (
    <div className='w-full flex items-center justify-center transition-colors duration-300'>
        <div className='my-24 md:my-32 w-[90%]'>
            <h4 className='text-center text-sm font-bold'>Courses</h4>
            <h2 className='text-3xl md:text-4xl font-bold text-center'>Courses Offered</h2>
            <div className='mt-8 w-full lg:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-8'>
              {courses.map((course) => <CourseCard key={course.id} courseTitle={course.courseTitle} subTitle={course.subTitle} type={course.type.toUpperCase()} language={course.language.toUpperCase()}  courseImg={course.courseImg} courseTag={course.courseTag.toUpperCase()} actualPrice={course.actualPrice} discountedPrice={course.discountedPrice} linkAddress={course.linkAddress}/>)}
            </div>
        </div>
    </div>
  )
}

export default Courses