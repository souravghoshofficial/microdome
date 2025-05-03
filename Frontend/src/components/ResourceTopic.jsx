import React from 'react'

import ResourceVideo from './ResourceVideo.jsx';
import ResourceNote from './ResourceNote.jsx';

const ResourceTopic = ({topic,videos,notes}) => {
  return (
    <div className='w-full flex justify-center items-center mt-8'>
    <div className='w-full'>
      <h2 className='text-2xl font-semibold md:text-3xl mb-8 md:font-bold'>Demo Videos on Operon System</h2>
      <div className='demo-videos w-full pl-2 md:pl-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2  w-full justify-center items-center'>
        {
          videos.map((video)=>(
            <ResourceVideo key={video.id} url={video.url} title={video.title}/>
          ))
        }

      </div>
      </div >

      <div className='notes'>
      {
          notes.map((note)=>(
            <ResourceNote key={note.title} url={note.file} title={note.title}/>
          ))
        }
      </div>
    </div>
    </div>
  )
}

export default ResourceTopic;