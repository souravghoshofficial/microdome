import React from 'react'
import DownloadBtn from './DownloadBtn';
import ViewBtn from './ViewBtn';
const ResourceNote = ({title,url}) => {
  return (
    <div className='w-full flex items-center justify-between p-4 rounded-lg mt-4 shadow-2xl dark:bg-zinc-800'>
      <div>
        <h2>{title}</h2>
      </div>

      <div className='flex gap-6'>
        <ViewBtn url={url}/>
        <DownloadBtn url={url}/>
      </div>
    </div>
  )
}

export default ResourceNote;