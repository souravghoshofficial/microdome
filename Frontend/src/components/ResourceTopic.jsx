import React from 'react'
import ResourceVideo from './ResourceVideo.jsx';
import ResourceNote from './ResourceNote.jsx';

const ResourceTopic = ({ topic, videos, notes }) => {
  return (
    <div className='w-full flex justify-center items-center mt-8'>
      <div className='w-full max-w-6xl'>
        <h2 className='text-2xl font-semibold md:text-3xl mb-8 md:font-bold text-center'>
          Demo Videos on Operon System
        </h2>

        <div className='demo-videos w-full flex justify-center'>
          <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-10'>
            {
              videos.map((video) => (
                <ResourceVideo key={video.id} url={video.url} title={video.title} />
              ))
            }
          </div>
        </div>

        <div className='notes mt-12'>
          <h2 className='text-2xl font-semibold md:text-3xl mb-8 md:font-bold text-center'>
            Notes of Operon System
          </h2>
          <div className='flex flex-col items-center gap-4'>
            {
              notes.map((note) => (
                <ResourceNote key={note.title} url={note.file} title={note.title} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceTopic;

