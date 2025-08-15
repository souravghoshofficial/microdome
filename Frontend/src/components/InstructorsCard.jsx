import React from 'react'


const InstructorsCard = ({name, image , subject , description , bgColor}) => {
  return (
    <div className='w-[96%] mx-auto flex flex-col bg-white dark:bg-gray-50/[.10] rounded-xl overflow-hidden justify-center items-center border border-zinc-900/15 dark:border-gray-700/25 hover:border-blue-500/50'>
        <div className={` ${bgColor} w-full flex items-center justify-center`}>
          <img className='h-72' src={image} alt="image" />
        </div>
        <div className='w-full px-4 py-6'>
            <h3 className='text-xl md:text-2xl font-bold'>{name}</h3>
            <h4 className='text-[16px] mt-0.5 text-highlighted font-medium'>{subject}</h4>
            <p className='mt-2 text-[14px] text-gray-700 dark:text-gray-400'>{description}</p>
        </div>
    </div>
  )
}

export default InstructorsCard