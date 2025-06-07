import React from 'react'
import { CourseCard } from '../components'

const BScHonsBatch = () => {
  const courses = [
    {
      id: 1,
      courseTitle: "Semester - I",
      subTitle: "Ultimate guide to excel in the Microbiology",
      courseTag: "B.Sc Hons.",
      type: "live",
      language: "hinglish",
      courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
      actualPrice: 1200,
      discountedPrice: 999,
      linkAddress: "#"
    },
    {
      id: 2,
      courseTitle: "Semester - II",
      subTitle: "Ultimate guide to excel in the Microbiology",
      courseTag: "B.Sc Hons.",
      type: "live",
      language: "hinglish",
      courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
      actualPrice: 1200,
      discountedPrice: 999,
      linkAddress: "#"
    },
    {
      id: 3,
      courseTitle: "Semester - III",
      subTitle: "Ultimate guide to excel in the Microbiology",
      courseTag: "B.Sc Hons.",
      type: "live",
      language: "hinglish",
      courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
      actualPrice: 1200,
      discountedPrice: 999,
      linkAddress: "#"
    },
    {
      id: 4,
      courseTitle: "Semester - IV",
      subTitle: "Ultimate guide to excel in the Microbiology",
      courseTag: "B.Sc Hons.",
      type: "live",
      language: "hinglish",
      courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
      actualPrice: 1200,
      discountedPrice: 999,
      linkAddress: "#"
    },
    {
      id: 5,
      courseTitle: "Semester - V",
      subTitle: "Ultimate guide to excel in the Microbiology",
      courseTag: "B.Sc Hons.",
      type: "live",
      language: "hinglish",
      courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
      actualPrice: 1500,
      discountedPrice: 1200,
      linkAddress: "#"
    },
    {
      id: 6,
      courseTitle: "Semester - VI",
      subTitle: "Ultimate guide to excel in the Microbiology",
      courseTag: "B.Sc Hons.",
      type: "live",
      language: "hinglish",
      courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
      actualPrice: 1500,
      discountedPrice: 1200,
      linkAddress: "#"
    },
  ]
  return (
    <div className='w-full flex items-center justify-center transition-colors duration-300'>
        <div className='my-24 md:my-32 w-[90%]'>
            <h2 className='text-3xl md:text-4xl font-bold text-center'>Semester Batches</h2>
            <div className='mt-8 w-full lg:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16'>
              {courses.map((course) => <CourseCard key={course.id} imageHeight='h-60' courseTitle={course.courseTitle} subTitle={course.subTitle} type={course.type.toUpperCase()} language={course.language.toUpperCase()}  courseImg={course.courseImg} courseTag={course.courseTag.toUpperCase()} actualPrice={course.actualPrice} discountedPrice={course.discountedPrice} linkAddress={course.linkAddress}/>)}
            </div>
        </div>
    </div>
  )
}

export default BScHonsBatch