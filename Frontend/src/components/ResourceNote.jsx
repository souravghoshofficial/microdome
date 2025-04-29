import React from 'react'
import DownloadBtn from './DownloadBtn';
const ResourceNote = () => {
  return (
    <div className='w-full flex items-center justify-between p-4 rounded-lg bg-cyan-300'>
      <div>
        <h2>Microbiology</h2>
      </div>
      <DownloadBtn/>
    </div>
  )
}

export default ResourceNote