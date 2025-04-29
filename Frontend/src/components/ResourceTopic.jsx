import React from 'react'
import ResourceVideo from './ResourceVideo.jsx';
import ResourceNotesContainer from './ResourceNotesContainer.jsx';
const ResourceTopic = () => {
  return (
    <div className='w-full flex justify-center items-center mt-8'>
    <div className='w-full '>
      <h2>Topic Name-Biotechnology</h2>
      <div className='demo-videos w-full'>
        <h3>demo videos</h3>
        <div className='w-full gap-8 items-center grid grid-cols-1 lg:grid-cols-2'>
        <ResourceVideo/>
        <ResourceVideo/>
        <ResourceVideo/>
        <ResourceVideo/>
        <ResourceVideo/>
        <ResourceVideo/>
        <ResourceVideo/>
        <ResourceVideo/>
        </div>
      </div>
      <ResourceNotesContainer/>
    </div>

    </div>

  )
}

export default ResourceTopic;