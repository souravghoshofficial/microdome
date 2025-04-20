import React from 'react'
import { CourseCard } from '../components'

const Courses = () => {
  const courses = [
    {
      id: 1,
      courseTitle: "IIT JAM Biotechnology",
      courseTag: "IIT JAM",
      courseImg: "https://i.pinimg.com/736x/6a/3e/55/6a3e559df3b2ab60acf2c0a8eca63dba.jpg",
      actualPrice: 4200,
      discountedPrice: 3600,
      linkAddress: "iit-jam"
    },
    {
      id: 2,
      courseTitle: "CUET PG Zoolgy",
      courseTag: "CUET PG",
      courseImg: "https://i.pinimg.com/736x/8a/9b/7d/8a9b7d0a4a157313595b401961a05785.jpg",
      actualPrice: 3600,
      discountedPrice: 3000,
      linkAddress: "#"
    },
    {
      id: 3,
      courseTitle: "CUET PG Botany",
      courseTag: "CUET PG",
      courseImg: "https://i.pinimg.com/736x/6a/3e/55/6a3e559df3b2ab60acf2c0a8eca63dba.jpg",
      actualPrice: 3600,
      discountedPrice: 3000,
      linkAddress: "#"
    },
    {
      id: 4,
      courseTitle: "CUET PG Physiology",
      courseTag: "CUET PG",
      courseImg: "https://i.pinimg.com/736x/62/2c/65/622c6522a470b3ebcedd2ea91609bacd.jpg",
      actualPrice: 3600,
      discountedPrice: 3000,
      linkAddress: "#"
    },
    {
      id: 5,
      courseTitle: "B.Sc Microbiology(H)",
      courseTag: "B.Sc Hons.",
      courseImg: "https://i.pinimg.com/736x/8a/9b/7d/8a9b7d0a4a157313595b401961a05785.jpg",
      actualPrice: 3000,
      discountedPrice: 3000,
      linkAddress: "#"
    },
  ]
  return (
    <div className='w-full flex items-center justify-center transition-colors duration-300'>
        <div className='my-24 md:my-32 w-[90%]'>
            <h4 className='text-center text-sm font-bold'>Courses</h4>
            <h2 className='text-3xl md:text-4xl font-bold text-center'>Courses Offered</h2>
            <div className='mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
              {courses.map((course) => <CourseCard key={course.id} courseTitle={course.courseTitle} courseImg={course.courseImg} courseTag={course.courseTag.toUpperCase()} actualPrice={course.actualPrice} discountedPrice={course.discountedPrice} linkAddress={course.linkAddress}/>)}
            </div>
        </div>
    </div>
  )
}

export default Courses