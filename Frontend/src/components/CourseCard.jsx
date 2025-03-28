import React from 'react'

const CourseCard = ({courseTitle , price , courseImg}) => {
  return (
    <div className='w-full flex flex-col border border-black'>
      <div className='w-full'>
        <img className='w-full' src={courseImg} alt="course image" />
      </div>
      <div className='p-3'>
        <h2 className='mt-2 text-xl font-bold'>{courseTitle}</h2>
        <h3 className='mt-1 texl-lg font-semibold'>{price}</h3>
        <button className='mt-4 w-full py-3 text-center text-bold cursor-pointer bg-black text-white'>View Details</button>
      </div>
    </div>
  )
}

export default CourseCard