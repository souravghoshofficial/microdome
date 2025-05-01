import React from 'react'
import DownloadBtn from './DownloadBtn';
const ResourceNote = ({noteTitle , noteUrl}) => {
  return (
    <div className='w-full lg:w-[95%] mx-auto my-5 flex items-center justify-between px-4 py-3 lg:px-6  rounded-lg text-black dark:bg-zinc-900/90 dark:text-white  bg-white shadow-lg border border-black/10 dark:border-zinc-700/40'>
      <div>
        <h5 className='font-medium'>{noteTitle}</h5>
      </div>
      <DownloadBtn noteUrl={noteUrl}/>
    </div>
  )
}

export default ResourceNote