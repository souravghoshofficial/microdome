import React from 'react'
import Brochure from './Brochure.jsx';

const BrochureTopic = ({ topic, brochures }) => {
  return (
    <div className='w-full flex justify-center items-center mt-8'>
      <div className='w-full max-w-6xl'>
        <div className='notes mt-12'>
          <div className='flex flex-col items-center gap-4'>
            {brochures.map((note) => (
              <Brochure 
                key={note.id || note.title} 
                url={note.file} 
                title={note.title} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrochureTopic;
