import React from 'react'
import Brochure from './Brochure.jsx';

const BrochureTopic = ({ topic, brochures }) => {
  return (
    <div className='w-full flex justify-center items-center mt-4'>
      <div className='w-full'>
        <div className='notes'>
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
