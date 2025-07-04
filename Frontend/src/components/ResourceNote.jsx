import React from 'react'
import DownloadBtn from './DownloadBtn';
import ViewBtn from './ViewBtn';

const ResourceNote = ({ title, url }) => {
  return (
    <div className='w-full flex items-center justify-between p-4 rounded-lg mt-4 border border-gray-300 shadow-md dark:border-zinc-600 dark:shadow-lg dark:bg-zinc-800'>
      <div>
        <h2>{title}</h2>
      </div>

      <div className='flex gap-6'>
        <ViewBtn url={url} />
        <DownloadBtn url={url} />
      </div>
    </div>
  )
}

export default ResourceNote;
