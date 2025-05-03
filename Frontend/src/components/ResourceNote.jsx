import React from 'react'
import DownloadBtn from './DownloadBtn';
const ResourceNote = ({title,url}) => {
  return (
    <div className='w-full flex items-center justify-between p-4 rounded-lg mt-4 shadow-2xl'>
      <div>
        <h2>{title}</h2>
      </div>
      <DownloadBtn url={url}/>
    </div>
  )
}

export default ResourceNote;