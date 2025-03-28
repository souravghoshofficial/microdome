import React from 'react'
import { CourseCard } from '../components'

const Courses = () => {
  const courses = [
    {
      id: 1,
      courseTitle: "IIT JAM Biotechnology",
      courseImg: "https://i.pinimg.com/736x/6a/3e/55/6a3e559df3b2ab60acf2c0a8eca63dba.jpg",
      price: "₹3600"
    },
    {
      id: 2,
      courseTitle: "CUET PG Zoolgy",
      courseImg: "https://i.pinimg.com/736x/8a/9b/7d/8a9b7d0a4a157313595b401961a05785.jpg",
      price: "₹3200"
    },
    {
      id: 3,
      courseTitle: "CUET PG Botany",
      courseImg: "https://i.pinimg.com/736x/6a/3e/55/6a3e559df3b2ab60acf2c0a8eca63dba.jpg",
      price: "₹3200"
    },
    {
      id: 4,
      courseTitle: "CUET PG Physiology",
      courseImg: "https://i.pinimg.com/736x/62/2c/65/622c6522a470b3ebcedd2ea91609bacd.jpg",
      price: "₹3200"
    },
    {
      id: 5,
      courseTitle: "B.Sc Microbiology(H)",
      courseImg: "https://i.pinimg.com/736x/8a/9b/7d/8a9b7d0a4a157313595b401961a05785.jpg",
      price: "₹3000"
    },
  ]
  return (
    <div className='w-full flex items-center justify-center'>
        <div className='my-16 w-[90%]'>
            <h4 className='text-center text-sm font-bold'>Courses</h4>
            <h2 className='text-3xl md:text-4xl font-bold text-center'>Courses Offered</h2>
            <div className='mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
              {courses.map((course) => < CourseCard key={course.id} courseTitle={course.courseTitle} courseImg={course.courseImg} price={course.price}/>)}
            </div>
        </div>
    </div>
  )
}

export default Courses