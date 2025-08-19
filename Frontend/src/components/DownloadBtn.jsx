import React from 'react';
import { Download } from 'lucide-react';

const DownloadBtn = ({ url }) => {
  return (
    <div>
      <a 
        href={url} 
        download
        className={`flex items-center justify-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg`}
      >
        <Download className='block lg:hidden w-4 h-4' />
        <span className='hidden lg:block'>Download</span>
      </a>
    </div>
  );
};

export default DownloadBtn;
