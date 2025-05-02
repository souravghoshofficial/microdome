import React from 'react'


const FacultyCard = ({index , facultyName , facultyTitle ,  facultyImage , facultyDescription , experties , bgColor}) => {
  return (
    <div className={`mt-16 w-full lg:h-[42vh] lg:w-[84%]  mx-auto flex flex-col ${index % 2 == 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center justify-between gap-4 rounded-xl text-[#1E1E1E]`}>
        <div className='faculty-image w-full h-full lg:w-[24%]  flex items-center justify-center'>
            <img className='rounded-xl w-64 md:w-80 lg:w-full h-full object-cover object-center' src={facultyImage} alt={facultyName} />
        </div>
        <div style={{backgroundColor: bgColor}} className={`faculty-description w-full lg:w-[72%] lg:h-full rounded-xl flex items-center justify-center`}>
            <div className='p-6 lg:px-8 lg:py-0'>
            <h3 className='text-2xl md:text-3xl font-bold'>{facultyName}</h3>
            <h4 className='mt-1 text-lg md:text-xl font-semibold'>{facultyTitle}</h4>
            <p className='mt-2 font-normal'>{facultyDescription}</p>
            <div className='mt-2'>
                <p className='inline-block mr-2 font-semibold'>Expertise in :</p>
                {experties.map((item) => (<div key={item} className='px-3 py-1 mt-2 bg-white text-black font-medium rounded-full text-[13px] inline-block mr-2'>{item}</div>))}
            </div>
            </div>
        </div>
    </div>
  )
}

export default FacultyCard