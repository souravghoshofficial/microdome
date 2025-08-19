import React from 'react';
import { Eye } from 'lucide-react';

const ViewBtn = ({ url }) => {
  return (
    <div>
      <a 
        href={url} 
        target='_blank' 
        rel="noopener noreferrer"
        className='flex items-center justify-center px-3 md:px-5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg'
      >
        <Eye className='block lg:hidden w-4 h-4' />
        <span className='hidden lg:block'>View</span>
      </a>
    </div>
  );
};

export default ViewBtn;
